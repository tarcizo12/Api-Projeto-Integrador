import { AnotacaoPacienteModel } from '../model/AnotacaoPacienteModel';
import { FiltroAnotacoes } from '../model/FiltroAnotacoes';
import { PacienteModel } from '../model/PacienteModel';
import { VisualizarAnotacaoRequest } from '../model/VisualizarAnotacaoRequest';


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
     * Método para persistir anotacao feita pelo paciente
     * @return Sequencial do registro feito
     */
    salvarAnoacaoPaciente(anotacaoParaSalvar: AnotacaoPacienteModel): Promise<number | undefined>;

    /**
     * Método atualizar registro de anotacao para VISUALIZADA do paciente
     * @return Sucesso para atualizar registro
     */
    visualizarAnotacao(anotacaoParaVisualizar: VisualizarAnotacaoRequest): Promise<boolean>;


    /**
     * Consultar anotacoes registradas por o paciente por filtro
     * @return Lista de Anotacoes
     */
    consultarAnotacoesComFiltro(filtro: FiltroAnotacoes): Promise<AnotacaoPacienteModel[]>;

    /**
     * Método para deletar as anotacoes do paciente
     * @return Registros deletados
     */
    deletarAnotacoesByIdPaciente(idPaciente: number): Promise<AnotacaoPacienteModel[]>;

    /**
     * Método para retornar o titulo da anotacao com IA
     * @return string do titulo
     */
    obterTituloAnotacaoPorIA(descricao : string): Promise<string>;
}
