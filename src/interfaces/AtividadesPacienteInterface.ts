import { AtividadePacienteModel } from '../model/AtividadePacienteModel';

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
}
