import { RequestBodyLogin } from "../model/RequestBodyLogin";
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
}
