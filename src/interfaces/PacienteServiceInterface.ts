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


    /**
     * Método para DELETAR a conta de um paciente por id
     * @return String nome paciente
     */
    deletarPacienteById(idPaciente: number): Promise<PacienteModel>;

    /**
     * Remove o vínculo do paciente com o psicólogo atual.
     */
    desvincularPsicologo(idPaciente: number): Promise<PacienteModel>;

    /**
     * Vincula o paciente a um psicólogo pelo ID do profissional.
     */
    vincularPsicologo(idPaciente: number, idPsicologo: number): Promise<PacienteModel>;

    /**
     * Atualiza dados do perfil do paciente.
     */
    atualizarPerfil(
      idPaciente: number,
      dados: { nome?: string; email?: string; telefone?: string | null }
    ): Promise<PacienteModel>;
}
