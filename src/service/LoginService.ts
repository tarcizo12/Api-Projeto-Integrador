import { LoginInterface } from "../interfaces/LoginInterface";
import { PsicologoServiceInterface } from "../interfaces/PsicologoServiceInterface";
import { PacienteModel } from "../model/PacienteModel";
import { PsicologoModel } from "../model/PsicologoModel";
import { RequestBodyLogin } from "../model/RequestBodyLogin";
import { UsuarioLogado } from "../model/UsuarioLogado";


/**
 * Classe de implementação dos contratos
 */
export class LoginService implements LoginInterface{

    async realizarLoginUsuario(requestLogin: RequestBodyLogin): Promise<UsuarioLogado> {
        try {
            const registroPacienteLocalizado: PacienteModel | null = await PacienteModel.findOne({
                where: { email: requestLogin.email },
            });

            const registroPsicologoLocalizado: PsicologoModel | null = await PsicologoModel.findOne({
                where: { email: requestLogin.email },
            });

            const registroLocalizado = registroPacienteLocalizado ? registroPacienteLocalizado : registroPsicologoLocalizado
            
            const usuarioInformouSenhaCorreta = registroLocalizado?.senha === requestLogin?.senha

            if(usuarioInformouSenhaCorreta){
                const usuarioLogadoInf : UsuarioLogado = {
                    isPsicologo : registroPsicologoLocalizado !== null,
                    isPaciente : registroPacienteLocalizado !== null,
                    usuarioLogadoData: registroLocalizado
                };

                return usuarioLogadoInf;
            }

            return {
                isPsicologo : null,
                isPaciente : null,
                usuarioLogadoData: null
            };
            
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter psicologo por ID: " + errorMessage);
        }
    }
}
