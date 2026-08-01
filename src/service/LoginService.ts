import { LoginInterface, SolicitarCodigoResultado } from "../interfaces/LoginInterface";
import { PacienteModel } from "../model/PacienteModel";
import { PsicologoModel } from "../model/PsicologoModel";
import { RequestBodyLogin } from "../model/RequestBodyLogin";
import UserPayload from "../model/UserPayload";
import { UsuarioLogado } from "../model/UsuarioLogado";
import { hashPassword, isPasswordHashed, verifyPassword } from "../utils/password";
import { signAccessToken } from "../utils/jwt";
import { sanitizeUser } from "../utils/sanitizeUser";
import {
  consumirCodigoRecuperacao,
  salvarCodigoRecuperacao,
  validarCodigoRecuperacao,
} from "../utils/passwordResetStore";
import {
  enviarCodigoRecuperacaoSenha,
  isEmailDeliveryConfigured,
} from "../utils/emailService";
import crypto from "crypto";

export class LoginService implements LoginInterface {
  async realizarCadastroNovoUsuario(requestCadastro: UserPayload): Promise<UsuarioLogado> {
    try {
      const pacienteExistente = await PacienteModel.findOne({ where: { email: requestCadastro.email } });
      const psicologoExistente = await PsicologoModel.findOne({ where: { email: requestCadastro.email } });

      if (pacienteExistente || psicologoExistente) {
        throw new Error("Já existe um usuário cadastrado com este e-mail.");
      }

      const isPsicologo = requestCadastro.isPsychologist;
      const isPaciente = !requestCadastro.isPsychologist;
      const senhaHash = await hashPassword(requestCadastro.password);

      const informacoesBasicas = {
        nome: requestCadastro.name,
        email: requestCadastro.email,
        senha: senhaHash,
        telefone: requestCadastro.phone || null,
        cpf: requestCadastro.cpf,
      };

      const informacoePsicologo = {
        dataNascimento: requestCadastro.birthDate,
        crp: requestCadastro.crp,
      };

      const informacoesPaciente = {
        Data_Nascimento: requestCadastro.birthDate,
        fk_idProfissional: requestCadastro.codigoPsicologoIndicador,
      };

      const novoUsuario = isPsicologo
        ? await PsicologoModel.create({ ...informacoesBasicas, ...informacoePsicologo })
        : await PacienteModel.create({ ...informacoesBasicas, ...informacoesPaciente });

      return this.buildUsuarioLogado(isPsicologo, isPaciente, novoUsuario);
    } catch (error) {
      const errorMessage = (error as { message?: string }).message || "erro desconhecido";
      throw new Error("Erro ao realizar cadastro de usuário: " + errorMessage);
    }
  }

  async realizarLoginUsuario(requestLogin: RequestBodyLogin): Promise<UsuarioLogado> {
    try {
      const registroPacienteLocalizado = await PacienteModel.findOne({
        where: { email: requestLogin.email },
      });

      const registroPsicologoLocalizado = await PsicologoModel.findOne({
        where: { email: requestLogin.email },
      });

      const registroLocalizado = registroPacienteLocalizado ?? registroPsicologoLocalizado;

      if (!registroLocalizado) {
        return {
          isPsicologo: null,
          isPaciente: null,
          usuarioLogadoData: null,
          token: null,
        };
      }

      const senhaValida = await verifyPassword(requestLogin.senha, registroLocalizado.senha);

      if (!senhaValida) {
        return {
          isPsicologo: null,
          isPaciente: null,
          usuarioLogadoData: null,
          token: null,
        };
      }

      // Migra senhas legadas em texto plano para bcrypt.
      if (!isPasswordHashed(registroLocalizado.senha)) {
        const novaHash = await hashPassword(requestLogin.senha);
        await registroLocalizado.update({ senha: novaHash });
      }

      return this.buildUsuarioLogado(
        registroPsicologoLocalizado !== null,
        registroPacienteLocalizado !== null,
        registroLocalizado
      );
    } catch (error) {
      const errorMessage = (error as { message?: string }).message || "erro desconhecido";
      throw new Error("Não foi possível realizar login: " + errorMessage);
    }
  }

  private buildUsuarioLogado(
    isPsicologo: boolean,
    isPaciente: boolean,
    usuario: PacienteModel | PsicologoModel
  ): UsuarioLogado {
    const userId =
      "idProfissional" in usuario && usuario.idProfissional
        ? usuario.idProfissional
        : (usuario as PacienteModel).idPaciente;

    const token = signAccessToken({
      userId,
      email: usuario.email,
      isPsicologo,
      isPaciente,
    });

    return {
      isPsicologo,
      isPaciente,
      usuarioLogadoData: sanitizeUser(usuario) as PacienteModel | PsicologoModel,
      token,
    };
  }

  async solicitarCodigoRecuperacao(email: string): Promise<SolicitarCodigoResultado> {
    const emailLimpo = email.trim().toLowerCase();
    const mensagemPadrao =
      'Se existir uma conta com este e-mail, enviamos um código de verificação.';

    if (!emailLimpo || !emailLimpo.includes('@')) {
      throw new Error('Informe um e-mail válido.');
    }

    const paciente = await PacienteModel.findOne({ where: { email: emailLimpo } });
    const psicologo = await PsicologoModel.findOne({ where: { email: emailLimpo } });
    const usuario = paciente ?? psicologo;

    // Evita enumeração de contas: resposta genérica mesmo se não existir.
    if (!usuario) {
      return { mensagem: mensagemPadrao };
    }

    const codigo = crypto.randomInt(100000, 1000000).toString();
    salvarCodigoRecuperacao(emailLimpo, codigo);

    try {
      await enviarCodigoRecuperacaoSenha(emailLimpo, codigo);
    } catch (error) {
      console.error('Falha ao enviar e-mail de recuperação', error);
      throw new Error('Não foi possível enviar o código. Tente novamente em instantes.');
    }

    const exporCodigoDev =
      process.env.ALLOW_DEV_RESET_CODE === 'true' ||
      (!isEmailDeliveryConfigured() && process.env.NODE_ENV !== 'production');

    return {
      mensagem: mensagemPadrao,
      ...(exporCodigoDev ? { codigoDev: codigo } : {}),
    };
  }

  async redefinirSenhaComCodigo(
    email: string,
    codigo: string,
    novaSenha: string
  ): Promise<void> {
    const emailLimpo = email.trim().toLowerCase();
    const codigoLimpo = String(codigo || '').replace(/\D/g, '');

    if (!emailLimpo || !emailLimpo.includes('@')) {
      throw new Error('Informe um e-mail válido.');
    }
    if (codigoLimpo.length !== 6) {
      throw new Error('Informe o código de 6 dígitos enviado por e-mail.');
    }
    if (!novaSenha || novaSenha.length < 4) {
      throw new Error('A nova senha deve ter pelo menos 4 caracteres.');
    }

    const codigoValido = validarCodigoRecuperacao(emailLimpo, codigoLimpo);
    if (!codigoValido) {
      throw new Error('Código inválido ou expirado. Solicite um novo código.');
    }

    const paciente = await PacienteModel.findOne({ where: { email: emailLimpo } });
    const psicologo = await PsicologoModel.findOne({ where: { email: emailLimpo } });
    const usuario = paciente ?? psicologo;

    if (!usuario) {
      throw new Error('Não encontramos uma conta com este e-mail.');
    }

    const senhaHash = await hashPassword(novaSenha);
    await usuario.update({ senha: senhaHash });
    consumirCodigoRecuperacao(emailLimpo);
  }

  async trocarSenha(
    userId: number,
    isPaciente: boolean,
    isPsicologo: boolean,
    senhaAtual: string,
    novaSenha: string
  ): Promise<void> {
    if (!novaSenha || novaSenha.length < 4) {
      throw new Error("A nova senha deve ter pelo menos 4 caracteres.");
    }

    const usuario = isPaciente
      ? await PacienteModel.findByPk(userId)
      : isPsicologo
        ? await PsicologoModel.findByPk(userId)
        : null;

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    const senhaValida = await verifyPassword(senhaAtual, usuario.senha);
    if (!senhaValida) {
      throw new Error("Senha atual incorreta.");
    }

    const senhaHash = await hashPassword(novaSenha);
    await usuario.update({ senha: senhaHash });
  }
}
