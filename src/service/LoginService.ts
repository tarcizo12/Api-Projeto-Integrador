import { LoginInterface } from "../interfaces/LoginInterface";
import { PacienteModel } from "../model/PacienteModel";
import { PsicologoModel } from "../model/PsicologoModel";
import { RequestBodyLogin } from "../model/RequestBodyLogin";
import UserPayload from "../model/UserPayload";
import { UsuarioLogado } from "../model/UsuarioLogado";


/**
 * Classe de implementação dos contratos
 */
export class LoginService implements LoginInterface{
    
    async realizarCadastroNovoUsuario(requestCadastro: UserPayload): Promise<UsuarioLogado> {
        try {
            console.log("Payload para cadastro: ", requestCadastro);
    
            const pacienteExistente = await PacienteModel.findOne({ where: { email: requestCadastro.email } });
            const psicologoExistente = await PsicologoModel.findOne({ where: { email: requestCadastro.email } });
    
            if (pacienteExistente || psicologoExistente) {
                throw new Error("Já existe um usuário cadastrado com este e-mail.");
            }
    
            let novoUsuario;
            let isPsicologo = false;
            let isPaciente = false;
    
            if (requestCadastro.isPsychologist) {
                novoUsuario = await PsicologoModel.create({
                    nome: requestCadastro.name,
                    email: requestCadastro.email,
                    senha: requestCadastro.password,
                    telefone: requestCadastro.phone || null,
                    dataNascimento: requestCadastro.birthDate,
                    crp: requestCadastro.crp,
                    cpf: "06559757307"
                });
                isPsicologo = true;
            } else {
                novoUsuario = await PacienteModel.create({
                    nome: requestCadastro.name,
                    email: requestCadastro.email,
                    senha: requestCadastro.password,
                    telefone: requestCadastro.phone || null,
                    dataNascimento: requestCadastro.birthDate,
                });
                isPaciente = true;
            }
    
            const usuarioLogado: UsuarioLogado = {
                isPsicologo,
                isPaciente,
                usuarioLogadoData: novoUsuario,
            };
    
            return usuarioLogado;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Erro ao realizar cadastro de usuário: " + errorMessage);
        }
    }
    

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

            console.log("Usuario tentando realizar login: ", requestLogin)

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
