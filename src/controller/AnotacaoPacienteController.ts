import { Request, Response } from 'express';
import HttpStatus from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { Parametros } from '../enums/Parametros';
import { AnotacaoPacienteService } from '../service/AnotacaoPacienteService';
import { AnotacaoPacienteInterface } from '../interfaces/AnotacaoPacienteInterface';
import { AnotacaoPacienteModel } from '../model/AnotacaoPacienteModel';
import { FiltroAnotacoes } from '../model/FiltroAnotacoes';
import {VisualizarAnotacaoRequest} from '../model/VisualizarAnotacaoRequest';

/**
 * Classe de controlle de aplicacao
 */
export default class AnotacaoPacienteController {
    private anotacaoPacienteService: AnotacaoPacienteInterface = new AnotacaoPacienteService; 

    public async getAnotacaoPorIdPaciente(req: Request, res: Response): Promise<Response> {
        const idPaciente: string = StringUtil.getQueryString(req.query, Parametros.ID_PACIENTE);
        if (!idPaciente) { return this.erroIdAnotacaoNaoInformado(res)}

        return res.status(HttpStatus.OK.code).json(await this.anotacaoPacienteService.listarAntacoesPorIdPaciente(Number(idPaciente)));
    }

    public async getDescricaoResumoResemanal(req: Request, res: Response): Promise<Response> {
        const idPaciente: string = StringUtil.getQueryString(req.query, Parametros.ID_PACIENTE);
        if (!idPaciente) { return this.erroIdAnotacaoNaoInformado(res) }
        
        try {
            return res.status(HttpStatus.OK.code).json(await this.anotacaoPacienteService.retornaResumoSemanalGerada(Number(idPaciente)));
        } catch (error) {
            console.error("Falha ao gerar resumo ", error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({message: "Falha intera ao gera resumo", cause: error})
        }
    }

    public async postAnotacao(req: Request, res: Response): Promise<Response> {
        try {
            const body: AnotacaoPacienteModel = req.body

            const idPaciente: number = body._fk_idPaciente

            if (!idPaciente) { return this.erroIdAnotacaoNaoInformado(res)}
            const idAnotacaoRegistrada = await this.anotacaoPacienteService.salvarAnoacaoPaciente(body)

            if(idAnotacaoRegistrada === undefined){
                return res.status(HttpStatus.BAD_REQUEST.code).json({ mensagem: "Nao foi possivel gerar novo registro de anotacao"});    
            }

            console.log("id salvo: ", idAnotacaoRegistrada)
            return res.status(HttpStatus.OK.code).json({ idAnotacao: idAnotacaoRegistrada});
        } catch (error) {
            console.error('Erro ao registrar anotacao', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
                mensagem: 'Não foi possível salvar a anotação. Tente novamente.',
            });
        }
    }

    public async putAnotacao(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.isPaciente) {
                return res.status(HttpStatus.FORBIDDEN.code).json({
                    message: 'Apenas pacientes podem editar registros.',
                });
            }

            const idAnotacao = Number(req.body?.idAnotacao);
            const titulo = String(req.body?.titulo || '').trim();
            const descricao = String(req.body?.descricao || '').trim();
            const emocaoEstimada =
                req.body?.emocaoEstimada !== undefined
                    ? String(req.body.emocaoEstimada || '').trim()
                    : undefined;

            if (!idAnotacao) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({
                    message: 'Informe o id da anotação.',
                });
            }

            const atualizada = await this.anotacaoPacienteService.atualizarAnotacaoPaciente(
                req.user.userId,
                { idAnotacao, titulo, descricao, emocaoEstimada }
            );

            return res.status(HttpStatus.OK.code).json({
                message: 'Registro atualizado com sucesso.',
                data: atualizada,
            });
        } catch (error) {
            const message = (error as Error)?.message || 'Erro ao atualizar anotação';
            const isClientError =
                message.includes('não encontrada') ||
                message.includes('Informe') ||
                message.includes('título') ||
                message.includes('descrição');

            console.error('Erro ao atualizar anotacao', error);
            return res
                .status(isClientError ? HttpStatus.BAD_REQUEST.code : HttpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ message });
        }
    }

    public async deleteAnotacao(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.isPaciente) {
                return res.status(HttpStatus.FORBIDDEN.code).json({
                    message: 'Apenas pacientes podem excluir registros.',
                });
            }

            const idAnotacao = Number(req.body?.idAnotacao || req.query?.idAnotacao);
            if (!idAnotacao) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({
                    message: 'Informe o id da anotação.',
                });
            }

            await this.anotacaoPacienteService.deletarAnotacaoById(req.user.userId, idAnotacao);
            return res.status(HttpStatus.OK.code).json({
                message: 'Registro excluído com sucesso.',
            });
        } catch (error) {
            const message = (error as Error)?.message || 'Erro ao excluir anotação';
            const isClientError = message.includes('não encontrada');

            console.error('Erro ao excluir anotacao', error);
            return res
                .status(isClientError ? HttpStatus.BAD_REQUEST.code : HttpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ message });
        }
    }

    public async visualizarAnotacao(req: Request, res: Response): Promise<Response> {
        const body: VisualizarAnotacaoRequest = req.body

        if (!body.idAnotacao) { return this.erroIdAnotacaoNaoInformado(res)}

        try {
            const resultsIsComSucesso = await this.anotacaoPacienteService.visualizarAnotacao(body)

            if (!resultsIsComSucesso) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({
                    mensagem: "Nao foi possivel atualizar anotacao para visualizada, id: " + body.idAnotacao,
                });
            }

            return res.status(HttpStatus.OK.code).json({
                mensagem: "Registro atualizado, id: " + body.idAnotacao,
            });
        } catch (error) {
            console.error('Erro ao marcar anotacao como visualizada', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
                mensagem: "Erro ao marcar anotacao como visualizada, id: " + body.idAnotacao,
            });
        }
    }

    public async getTituloAnotacaoByDescricao(req: Request, res: Response): Promise<Response> {
        try {
            const descricao = req.query.descricao as string;
            if (!descricao?.trim()) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({
                    message: 'Informe a descrição para gerar o título.',
                });
            }

            const tituloGerado: string =
                await this.anotacaoPacienteService.obterTituloAnotacaoPorIA(descricao);

            return res.status(HttpStatus.OK.code).json({ tituloGerado });
        } catch (error) {
            console.error('Erro ao gerar titulo por IA', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
                message: 'Não foi possível gerar o título no momento. Tente novamente.',
            });
        }
    }

    public async getAnotacoesPorFiltro(req: Request, res: Response): Promise<Response> {
        try {
            const filtros: FiltroAnotacoes = req.body.filtros;
            
            const anotacoesFiltradas = await this.anotacaoPacienteService.consultarAnotacoesComFiltro(filtros);
            
            return res.status(HttpStatus.OK.code).json(anotacoesFiltradas);
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes relacionados a esse psicologo:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes desse profissional" , statusReturn.description));
        }
    }
    

    private erroIdAnotacaoNaoInformado = (res: Response) => {
        
        return res.status(HttpStatus.BAD_REQUEST.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar anotacao", "Id do paciente obrigatorio"));   
    }
}
