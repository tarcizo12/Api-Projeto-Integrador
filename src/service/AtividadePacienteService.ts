import { AtividadesPacienteInterface } from "../interfaces/AtividadesPacienteInterface";
import { AtividadePacienteModel } from "../model/AtividadePacienteModel";

/**
 * Classe de implementação dos contratos
 */
export class AtividadePacienteService implements AtividadesPacienteInterface{

    listarTodasAtividades(): Promise<AtividadePacienteModel[]> {
        return AtividadePacienteModel.findAll();
    }

    async deletarAtividadesByIdPaciente(idPaciente: number): Promise<AtividadePacienteModel[]> {
        try {
            const atividades: AtividadePacienteModel[] = await AtividadePacienteModel.findAll({
                where: { fk_idPaciente: idPaciente }
            });

            await AtividadePacienteModel.destroy({
                where: { fk_idPaciente: idPaciente }
            });

            return atividades;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Erro desconhecido';
            throw new Error("Erro ao deletar atividades do paciente: " + errorMessage);
        }
    }

    async buscarAtividadeById(idAtividade: number): Promise<AtividadePacienteModel> {
        try {
            const atividade: AtividadePacienteModel | null = await AtividadePacienteModel.findByPk(idAtividade);

            if (!atividade) {
                throw new Error("Atividade não encontrada");
            }
            
            return atividade;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter atividade por ID: " + errorMessage);
        }
    }

    buscarAtividadesByIdPaciente(fk_idPaciente: number): Promise<AtividadePacienteModel[]> {
        try {
            return AtividadePacienteModel.findAll({where: {fk_idPaciente} });
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter atividades relacionadas á esse id de paciente " + errorMessage);
        }
    }

 
}
