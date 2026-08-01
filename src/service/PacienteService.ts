import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AtividadesPacienteInterface } from "../interfaces/AtividadesPacienteInterface";
import { PacienteServiceInterface } from "../interfaces/PacienteServiceInterface";
import { PacienteModel } from "../model/PacienteModel";
import { PsicologoModel } from "../model/PsicologoModel";
import { AnotacaoPacienteService } from "./AnotacaoPacienteService";
import { AtividadePacienteService } from "./AtividadePacienteService";


/**
 * Classe de implementação dos contratos
 */
export class PacienteService implements PacienteServiceInterface{
    private anotacaoPacienteService: AnotacaoPacienteInterface = new AnotacaoPacienteService; 
    private atividadePacienteService: AtividadesPacienteInterface = new AtividadePacienteService; 

    async desvincularPsicologo(idPaciente: number): Promise<PacienteModel> {
        const paciente = await PacienteModel.findByPk(idPaciente);
        if (!paciente) {
            throw new Error("Paciente não encontrado");
        }

        await paciente.update({ fk_idProfissional: null });
        return paciente.reload();
    }

    async vincularPsicologo(idPaciente: number, idPsicologo: number): Promise<PacienteModel> {
        const paciente = await PacienteModel.findByPk(idPaciente);
        if (!paciente) {
            throw new Error("Paciente não encontrado");
        }

        const psicologo = await PsicologoModel.findByPk(idPsicologo);
        if (!psicologo) {
            throw new Error("Psicólogo não encontrado");
        }

        await paciente.update({ fk_idProfissional: idPsicologo });
        return paciente.reload();
    }

    async atualizarPerfil(
        idPaciente: number,
        dados: { nome?: string; email?: string; telefone?: string | null }
    ): Promise<PacienteModel> {
        const paciente = await PacienteModel.findByPk(idPaciente);
        if (!paciente) {
            throw new Error("Paciente não encontrado");
        }

        const payload: Record<string, unknown> = {};
        if (typeof dados.nome === 'string' && dados.nome.trim()) {
            payload.nome = dados.nome.trim();
        }
        if (typeof dados.email === 'string' && dados.email.trim()) {
            const email = dados.email.trim().toLowerCase();
            const [pacienteEmail, psicologoEmail] = await Promise.all([
                PacienteModel.findOne({ where: { email } }),
                PsicologoModel.findOne({ where: { email } }),
            ]);
            if (
                (pacienteEmail && pacienteEmail.idPaciente !== idPaciente) ||
                psicologoEmail
            ) {
                throw new Error('Já existe um usuário com este e-mail.');
            }
            payload.email = email;
        }
        if (dados.telefone !== undefined) {
            const telefone =
                dados.telefone === null || dados.telefone === ''
                    ? null
                    : String(dados.telefone).replace(/\D/g, '');
            payload.telefone = telefone;
        }

        await paciente.update(payload);
        return paciente.reload();
    }

    async deletarPacienteById(idPaciente: number): Promise<PacienteModel> {
        try {
            const paciente: PacienteModel | null = await PacienteModel.findByPk(idPaciente);
            const qntdAnotacoesDeletadas = await this.anotacaoPacienteService.deletarAnotacoesByIdPaciente(idPaciente)
            const qntdAtividadesDeletadas = await  this.atividadePacienteService.deletarAtividadesByIdPaciente(idPaciente)

            if (!paciente) {
                throw new Error("Paciente não encontrado para exclusao");
            }
    
            await PacienteModel.destroy({  where: { idPaciente }});
            
            console.log(`Conta de paciente ${paciente.nome} deletada, registros relacionados deletados: \n`)
            console.log(`Quantidade de anotacoes deletadas : ${qntdAnotacoesDeletadas}`)
            console.log(`Quantidade de atividades deletadas : ${qntdAtividadesDeletadas}`)
            return paciente; 
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível deletar paciente por ID: " + errorMessage);
        }
    }    

    listarTodosPacientes(): Promise<PacienteModel[]> {
        return PacienteModel.findAll()
    }

    async buscarPacienteById(idPaciente: number): Promise<PacienteModel> {
        try {
            const paciente: PacienteModel | null = await PacienteModel.findByPk(idPaciente);

            if (!paciente) {
                throw new Error("Paciente não encontrado");
            }

            return paciente;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter paciente por ID: " + errorMessage);
        }
    }
    
    
    buscarPacientesByIdPsicologo(fk_idProfissional: number): Promise<PacienteModel[]> {
        try {
            return PacienteModel.findAll({where: {fk_idProfissional} });
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter pacientes relacionados á esse id de profissional " + errorMessage);
        }
    }
 
}
