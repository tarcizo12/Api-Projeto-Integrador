import { PsicologoModel } from '../model/PsicologoModel';

/**
 * Classe de contrato
 */
export interface PsicologoServiceInterface {
    /**
     * Método para Buscar todos os usuários de perfil "Psicologo"
     * @return Todos os psicologos
     */
    listarTodosPsicologos(): Promise<PsicologoModel[]>;

    /**
     * Método para Buscar psicologo por id
     * @return Psicologo
     */
    buscarPsicologoById(idPaciente: number): Promise<PsicologoModel>
}
