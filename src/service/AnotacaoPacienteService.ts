import { Op, WhereOptions } from 'sequelize';
import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AnotacaoPacienteModel } from "../model/AnotacaoPacienteModel";
import obterEmocaoDescricaoAnotacao from '../groq/GroqConfig';
import { FiltroAnotacoes } from "../model/FiltroAnotacoes";

/**
 * Gera a cláusula where com base nos filtros recebidos
 */
const montarClausulaWhereFiltro = (filtro: FiltroAnotacoes): WhereOptions => {
    const where: WhereOptions = {
        fk_idPaciente: filtro.idPaciente
    };

    if (filtro.dtInicio && filtro.dtFim) {
        where.dhRegistro = {
            [Op.between]: [new Date(filtro.dtInicio), new Date(filtro.dtFim)]
        };
    } else if (filtro.dtInicio) {
        where.dhRegistro = {
            [Op.gte]: new Date(filtro.dtInicio)
        };
    } else if (filtro.dtFim) {
        where.dhRegistro = {
            [Op.lte]: new Date(filtro.dtFim)
        };
    }

    if (typeof filtro.isVisualizado === 'boolean') {
        where.isVisualizada = filtro.isVisualizado;
    }

    return where;
}

/**
 * Classe de implementação dos contratos
 */
export class AnotacaoPacienteService implements AnotacaoPacienteInterface {

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
