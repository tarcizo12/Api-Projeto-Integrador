import { PsicologoServiceInterface } from "../interfaces/PsicologoServiceInterface";
import { PacienteModel } from "../model/PacienteModel";
import { PsicologoModel } from "../model/PsicologoModel";


/**
 * Classe de implementação dos contratos
 */
export class PsicologoService implements PsicologoServiceInterface{

    async criarVinculoComContaPaciente(idPaciente: number, idPsicologoLogado: number): Promise<boolean> {
        try {
        const [linhasAfetadas] = await PacienteModel.update(
            { fk_idProfissional: idPsicologoLogado },
            { where: { idPaciente } }
        );

        console.log(`Paciente com idPaciente = ${idPaciente} atualizado com sucesso. Linhas afetadas: ${linhasAfetadas}`);
        return true
        } catch (error) {
            console.error('Erro ao atualizar fk_idProfissional do paciente:', error);

            throw new Error("Não foi possível criar vinculo entre perfil do Psicologo com paciente informado");
        }
    }


    async buscarPsicologoById(idPsicologo: number): Promise<PsicologoModel> {
        try {
            const psicologo: PsicologoModel | null = await PsicologoModel.findByPk(idPsicologo);

            if (!psicologo) {
                throw new Error("Psicologo não encontrado");
            }

            return psicologo;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter psicologo por ID: " + errorMessage);
        }
    }

    listarTodosPsicologos(): Promise<PsicologoModel[]> {
        return PsicologoModel.findAll();
    }
 
}
