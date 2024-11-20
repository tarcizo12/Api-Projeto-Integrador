import { PacienteModel } from '../model/PacienteModel';

/**
 * Classe de contrato
 */
export interface PacienteServiceInterface {
    /**
     * Método para Buscar todos os usuários de perfil "Paciente"
     * @return Todos os pacientes
     */
    listarTodosPacientes(): Promise<PacienteModel[]>;

    
    /**
     * Método para Buscar paciente por id
     * @return Paciente
     */
    buscarPacienteById(idPaciente: number): Promise<PacienteModel>;

    
    /**
     * Método para Buscar todos os pacientes do profissional
     * @return Todos os pacientes do profissional
     */
    buscarPacientesByIdPsicologo(idPsicologo: number): Promise<PacienteModel[]>;
}
