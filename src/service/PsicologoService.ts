import { PsicologoServiceInterface } from "../interfaces/PsicologoServiceInterface";
import { PsicologoModel } from "../model/PsicologoModel";


/**
 * Classe de implementação dos contratos
 */
export class PsicologoService implements PsicologoServiceInterface{

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
