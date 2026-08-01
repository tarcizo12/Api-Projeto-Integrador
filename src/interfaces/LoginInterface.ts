import { RequestBodyLogin } from "../model/RequestBodyLogin";
import UserPayload from "../model/UserPayload";
import { UsuarioLogado } from "../model/UsuarioLogado";

export type SolicitarCodigoResultado = {
  mensagem: string;
  /** Presente apenas em desenvolvimento / sem SMTP, para facilitar testes. */
  codigoDev?: string;
};

/**
 * Classe de contrato
 */
export interface LoginInterface {

    /**
     * Método para Buscar todos os usuários de perfil "Psicologo"
     * @return Todos os psicologos
     */
    realizarLoginUsuario(requestLogin: RequestBodyLogin): Promise<UsuarioLogado>;

    /**
     * Método para Buscar todos os usuários de perfil "Psicologo"
     * @return Todos os psicologos
    */
    realizarCadastroNovoUsuario(requestCadastro: UserPayload): Promise<UsuarioLogado>;

    /**
     * Envia (ou registra) um código de recuperação para o e-mail informado.
     */
    solicitarCodigoRecuperacao(email: string): Promise<SolicitarCodigoResultado>;

    /**
     * Redefine a senha após validar o código recebido por e-mail.
     */
    redefinirSenhaComCodigo(email: string, codigo: string, novaSenha: string): Promise<void>;

    /**
     * Troca senha do usuário autenticado.
     */
    trocarSenha(
      userId: number,
      isPaciente: boolean,
      isPsicologo: boolean,
      senhaAtual: string,
      novaSenha: string
    ): Promise<void>;
}
