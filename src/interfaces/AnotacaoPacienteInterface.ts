import { AnotacaoPacienteModel } from '../model/AnotacaoPacienteModel';
import { PacienteModel } from '../model/PacienteModel';


/**
 * Classe de contrato
 */
export interface AnotacaoPacienteInterface {
    /**
     * Método para Buscar as anotacoes por id do paciente
     * @return Todos as anotacoes do paciente
     */
    listarAntacoesPorIdPaciente(fk_idPaciente: number): Promise<AnotacaoPacienteModel[]>;


    /**
     * Método para persistir anotacao feita por p paciente
     * @return Sequencial do registro feito
     */
    salvarAnoacaoPaciente(anotacaoParaSalvar: AnotacaoPacienteModel): Promise<number | undefined>;

}
