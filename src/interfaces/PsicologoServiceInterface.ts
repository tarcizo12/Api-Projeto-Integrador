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

     /**
     * Método para vincular Paciente ao psicologo por compartilhamento do ID
     * @return True em caso de sucesso
     */
    criarVinculoComContaPaciente(idPaciente: number, idPsicologoLogado: number): Promise<boolean>;

    /**
     * Atualiza dados do perfil do psicólogo.
     */
    atualizarPerfil(
      idPsicologo: number,
      dados: { nome?: string; email?: string; crp?: string }
    ): Promise<PsicologoModel>;

    /**
     * Exclui a conta do psicólogo e remove vínculos com pacientes.
     */
    deletarConta(idPsicologo: number): Promise<PsicologoModel>;
}
