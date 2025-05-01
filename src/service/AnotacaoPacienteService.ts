import { Op, WhereOptions } from 'sequelize';
import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AnotacaoPacienteModel } from "../model/AnotacaoPacienteModel";
import obterEmocaoDescricaoAnotacao from '../groq/GroqConfig';
import { FiltroAnotacoes } from "../model/FiltroAnotacoes";
import { parse } from 'date-fns';
import {VisualizarAnotacaoRequest} from '../model/VisualizarAnotacaoRequest'
/**
 * Gera a cláusula where com base nos filtros recebidos
 */
const montarClausulaWhereFiltro = (filtro: FiltroAnotacoes): WhereOptions => {
    const where: WhereOptions = {
        fk_idPaciente: filtro.idPaciente
    };

    const formatoData = 'd/M/yyyy'; 

    if (filtro.dtInicio && filtro.dtFim) {
        const inicio = parse(filtro.dtInicio, formatoData, new Date());
        const fim = parse(filtro.dtFim, formatoData, new Date());
        where.dhRegistro = { [Op.between]: [inicio, fim] };
    } else if (filtro.dtInicio) {
        const inicio = parse(filtro.dtInicio, formatoData, new Date());
        where.dhRegistro = { [Op.gte]: inicio };
    } else if (filtro.dtFim) {
        const fim = parse(filtro.dtFim, formatoData, new Date());
        where.dhRegistro = { [Op.lte]: fim };
    }

    if (typeof filtro.isVisualizado === 'boolean') {
        where.isVisualizada = filtro.isVisualizado;
    }

    if (filtro.categorias && filtro.categorias.length > 0) {
        where.emocaoEstimada = { [Op.in]: filtro.categorias };
    }

    return where;
};

/**
 * Classe de implementação dos contratos
 */
export class AnotacaoPacienteService implements AnotacaoPacienteInterface {


    async visualizarAnotacao(anotacaoParaVisualizar: VisualizarAnotacaoRequest): Promise<boolean> {
        try {
            const [linhasAtualizadas] = await AnotacaoPacienteModel.update(
                { isVisualizada: anotacaoParaVisualizar.isVisualizada ? 1 : 0 },
                { where: { idAnotacao: anotacaoParaVisualizar.idAnotacao } }
            );
            
            console.log("Anotacoes atualizadas para visualizadas : ", linhasAtualizadas)
            return true;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Erro desconhecido';
            throw new Error("Erro ao atualizar anotação: " + errorMessage);
        }
    }


    consultarAnotacoesComFiltro(filtro: FiltroAnotacoes): Promise<AnotacaoPacienteModel[]> {
        try {
            const where = montarClausulaWhereFiltro(filtro);

            return AnotacaoPacienteModel.findAll({
                where,
                order: [['idAnotacao', 'DESC']]
            });
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Erro desconhecido';
            throw new Error("Não foi possível obter as anotações desse paciente: " + errorMessage);
        }
    }

    listarAntacoesPorIdPaciente(fk_idPaciente: number): Promise<AnotacaoPacienteModel[]> {
        try {
            return AnotacaoPacienteModel.findAll({
                where: { fk_idPaciente },
                order: [['idAnotacao', 'DESC']]
            });
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Erro desconhecido';
            throw new Error("Não foi possível obter as anotações desse paciente: " + errorMessage);
        }
    }

    async salvarAnoacaoPaciente(anotacaoParaSalvar: AnotacaoPacienteModel): Promise<number | undefined> {
        const { titulo, emocaoEstimada } = await obterEmocaoDescricaoAnotacao(anotacaoParaSalvar.descricao);

        try {
            const objetoParaSalvar = {
                descricao: anotacaoParaSalvar.descricao,
                emocaoEstimada,
                titulo,
                dhRegistro: new Date(),
                fk_idPaciente: anotacaoParaSalvar._fk_idPaciente,
            }

            const novaAnotacao = await AnotacaoPacienteModel.create(objetoParaSalvar);

            console.log("Nova anotacao salva: ", novaAnotacao)
            return novaAnotacao.idAnotacao;
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
            return undefined;
        }
    }
}
