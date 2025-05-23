import { AtividadePacienteModel } from '../model/AtividadePacienteModel';


/**
 * Classe de contrato
 */
export interface AtividadesPacienteInterface {
    /**
     * Método para Buscar todas as atividades na base de dados
     * @return Todos os pacientes
     */
    listarTodasAtividades(): Promise<AtividadePacienteModel[]>;

    
    /**
     * Método para Buscar atividade por id
     * @return Atividade
     */
    buscarAtividadeById(idAtividade: number): Promise<AtividadePacienteModel>;

    
    /**
     * Método para Buscar todas as atividades do paciente
     * @return Todos os pacientes do profissional
     */
    buscarAtividadesByIdPaciente(idPaciente: number): Promise<AtividadePacienteModel[]>;

    /**
     * Método para deletar as atividades atribuidas ao paciente
     * @return Registros deletados
     */
    deletarAtividadesByIdPaciente(idPaciente: number): Promise<AtividadePacienteModel[]>;
}
