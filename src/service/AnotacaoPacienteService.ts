import { Op, WhereOptions } from 'sequelize';
import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AnotacaoPacienteModel } from "../model/AnotacaoPacienteModel";
import { obterEmocaoDescricaoAnotacao, obterResumoSemanalAnotacoes, obterTituloAnotacao } from '../groq/GroqConfig';
import { FiltroAnotacoes } from "../model/FiltroAnotacoes";
import { parse, startOfDay, subDays } from 'date-fns';
import { VisualizarAnotacaoRequest } from '../model/VisualizarAnotacaoRequest'
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

    async deletarAnotacoesByIdPaciente(idPaciente: number): Promise<AnotacaoPacienteModel[]> {
        try {
            const anotacoes: AnotacaoPacienteModel[] = await AnotacaoPacienteModel.findAll({
                where: { fk_idPaciente: idPaciente }
            });

            await AnotacaoPacienteModel.destroy({
                where: { fk_idPaciente: idPaciente }
            });

            return anotacoes;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Erro desconhecido';
            throw new Error("Erro ao deletar anotações do paciente: " + errorMessage);
        }
    }


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

    async retornaResumoSemanalGerada(idPaciente: number): Promise<string> {
        const anotacoesPaciente = await this.listarAnotacoesUltimaSemanaPorPaciente(idPaciente);
        const descricaoGerada = await obterResumoSemanalAnotacoes(anotacoesPaciente);
        console.log("Anotacoes : ", anotacoesPaciente)
        await Promise.all(
            anotacoesPaciente.map((anotacao) =>
                this.visualizarAnotacao({
                    idAnotacao: anotacao.idAnotacao,
                    isVisualizada: true
                })
            )
        );

        return descricaoGerada;
    }


    async listarAnotacoesUltimaSemanaPorPaciente(idPaciente: number): Promise<AnotacaoPacienteModel[]> {
        try {
            const hoje = startOfDay(new Date());
            const umaSemanaAtras = subDays(hoje, 7);

            const anotacoes = await AnotacaoPacienteModel.findAll({
                where: {
                    fk_idPaciente: idPaciente,
                    dhRegistro: {
                        [Op.between]: [umaSemanaAtras, hoje]
                    }
                },
                order: [['dhRegistro', 'DESC']]
            });

            return anotacoes;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Erro desconhecido';
            throw new Error("Erro ao listar anotações da última semana: " + errorMessage);
        }
    }

    async salvarAnoacaoPaciente(anotacaoParaSalvar: AnotacaoPacienteModel): Promise<number | undefined> {
        const { emocaoEstimada } = await obterEmocaoDescricaoAnotacao(anotacaoParaSalvar.descricao);

        try {
            const objetoParaSalvar = {
                descricao: anotacaoParaSalvar.descricao,
                emocaoEstimada,
                titulo: anotacaoParaSalvar.titulo,
                dhRegistro: new Date(),
                fk_idPaciente: anotacaoParaSalvar._fk_idPaciente,
            }

            const novaAnotacao = await AnotacaoPacienteModel.create(objetoParaSalvar);

            return novaAnotacao.idAnotacao;
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
            return undefined;
        }
    }

    async obterTituloAnotacaoPorIA(descricao: string): Promise<string> {
        const { titulo } = await obterTituloAnotacao(descricao);

        return titulo
    }
}
