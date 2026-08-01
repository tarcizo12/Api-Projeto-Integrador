import { Request, Response } from 'express';
import HttpStatus from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { LoginInterface } from '../interfaces/LoginInterface';
import { LoginService } from '../service/LoginService';
import { UsuarioLogado } from '../model/UsuarioLogado';
import UserPayload from '../model/UserPayload';

export class LoginController {
  private loginService: LoginInterface = new LoginService();

  public async postLoginUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const data: UsuarioLogado = await this.loginService.realizarLoginUsuario(req.body);
      const isLoginRealizadoComSucesso = data.usuarioLogadoData !== null;

      if (isLoginRealizadoComSucesso) {
        return res.status(HttpStatus.OK.code).json({
          message: 'Usuario logado com sucesso',
          data,
        });
      }

      return res.status(HttpStatus.UNAUTHORIZED.code).json({
        message: 'Falha ao realizar login, verifique email e senha.',
      });
    } catch (error) {
      console.error('Erro ao realizar login do usuario', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json(
          ErroBodyMensage.createErrorBody(
            'Erro ao realizar login',
            HttpStatus.INTERNAL_SERVER_ERROR.description
          )
        );
    }
  }

  public async postCadastroNovoUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const novoUsuarioPayload: UserPayload = req.body;
      const usuarioCadastrado: UsuarioLogado =
        await this.loginService.realizarCadastroNovoUsuario(novoUsuarioPayload);

      return res.status(HttpStatus.CREATED.code).json({
        message: 'Usuario criado com sucesso',
        data: usuarioCadastrado,
      });
    } catch (error) {
      const message = (error as Error)?.message || 'Erro ao realizar cadastro';
      const isConflict = message.includes('Já existe um usuário');

      console.error('Erro ao cadastrar usuario', error);
      return res.status(isConflict ? HttpStatus.CONFLICT.code : HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message,
      });
    }
  }

  public async postSolicitarCodigoRecuperacao(req: Request, res: Response): Promise<Response> {
    try {
      const email = String(req.body?.email || '').trim();

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST.code).json({
          message: 'Informe o e-mail da conta.',
        });
      }

      const resultado = await this.loginService.solicitarCodigoRecuperacao(email);
      return res.status(HttpStatus.OK.code).json({
        message: resultado.mensagem,
        ...(resultado.codigoDev ? { codigoDev: resultado.codigoDev } : {}),
      });
    } catch (error) {
      const message = (error as Error)?.message || 'Erro ao solicitar código';
      const isClientError =
        message.includes('e-mail válido') || message.includes('enviar o código');

      console.error('Erro ao solicitar código de recuperação', error);
      return res
        .status(isClientError ? HttpStatus.BAD_REQUEST.code : HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message });
    }
  }

  public async postRedefinirSenhaComCodigo(req: Request, res: Response): Promise<Response> {
    try {
      const email = String(req.body?.email || '').trim();
      const codigo = String(req.body?.codigo || '').trim();
      const novaSenha = String(req.body?.novaSenha || '');

      if (!email || !codigo || !novaSenha) {
        return res.status(HttpStatus.BAD_REQUEST.code).json({
          message: 'Informe e-mail, código e a nova senha.',
        });
      }

      await this.loginService.redefinirSenhaComCodigo(email, codigo, novaSenha);
      return res.status(HttpStatus.OK.code).json({
        message: 'Senha redefinida com sucesso. Você já pode entrar com a nova senha.',
      });
    } catch (error) {
      const message = (error as Error)?.message || 'Erro ao redefinir senha';
      const isClientError =
        message.includes('Código') ||
        message.includes('código') ||
        message.includes('e-mail') ||
        message.includes('nova senha') ||
        message.includes('Não encontramos');

      console.error('Erro ao redefinir senha com código', error);
      return res
        .status(isClientError ? HttpStatus.BAD_REQUEST.code : HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message });
    }
  }

  public async postTrocarSenha(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(HttpStatus.UNAUTHORIZED.code).json({
          message: 'Token de autenticação ausente.',
        });
      }

      const senhaAtual = String(req.body?.senhaAtual || '');
      const novaSenha = String(req.body?.novaSenha || '');

      if (!senhaAtual || !novaSenha) {
        return res.status(HttpStatus.BAD_REQUEST.code).json({
          message: 'Informe a senha atual e a nova senha.',
        });
      }

      await this.loginService.trocarSenha(
        req.user.userId,
        Boolean(req.user.isPaciente),
        Boolean(req.user.isPsicologo),
        senhaAtual,
        novaSenha
      );

      return res.status(HttpStatus.OK.code).json({
        message: 'Senha alterada com sucesso.',
      });
    } catch (error) {
      const message = (error as Error)?.message || 'Erro ao trocar senha';
      const isClientError =
        message.includes('incorreta') ||
        message.includes('nova senha') ||
        message.includes('não encontrado');

      console.error('Erro ao trocar senha', error);
      return res
        .status(isClientError ? HttpStatus.BAD_REQUEST.code : HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message });
    }
  }
}
