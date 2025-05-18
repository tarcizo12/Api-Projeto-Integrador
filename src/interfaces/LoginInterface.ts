import { RequestBodyLogin } from "../model/RequestBodyLogin";
import UserPayload from "../model/UserPayload";
import { UsuarioLogado } from "../model/UsuarioLogado";


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
}
