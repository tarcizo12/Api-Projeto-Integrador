import { Request, Response } from 'express';
import HttpStatus from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage'
import { RequestBodyLogin } from '../model/RequestBodyLogin';
import { LoginInterface } from '../interfaces/LoginInterface';
import { LoginService } from '../service/LoginService';
import { UsuarioLogado } from '../model/UsuarioLogado';


/**
 * Classe de controlle do login
 */
export class LoginController{

    private loginService: LoginInterface = new LoginService;


    public async postLoginUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const data: UsuarioLogado = await this.loginService.realizarLoginUsuario(req.body)

            const isLoginRealizadoComSucesso = data.usuarioLogadoData !== null

            if(isLoginRealizadoComSucesso){
                return res.status(HttpStatus.OK.code).json({ message: "Usuario logado com sucesso", data});
            }else{
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: "Falha ao realizar login, verifique email e senha."});
            }
        }catch(error){
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao realizar login do usuario', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao criar vinculo de contas entre Psicologo e Paciente" , statusReturn.description));
        }
    }
}