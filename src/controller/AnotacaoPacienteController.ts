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
        const body: AnotacaoPacienteModel = req.body

        const idPaciente: number = body._fk_idPaciente

        if (!idPaciente) { return this.erroIdAnotacaoNaoInformado(res)}
        const idAnotacaoRegistrada = await this.anotacaoPacienteService.salvarAnoacaoPaciente(body)

        if(idAnotacaoRegistrada === undefined){
            return res.status(HttpStatus.BAD_REQUEST.code).json({ mensagem: "Nao foi possivel gerar novo registro de anotacao"});    
        }

        console.log("id salvo: ", idAnotacaoRegistrada)
        return res.status(HttpStatus.OK.code).json({ idAnotacao: idAnotacaoRegistrada});
    }

    public async visualizarAnotacao(req: Request, res: Response): Promise<Response> {
        const body: VisualizarAnotacaoRequest = req.body

        if (!body.idAnotacao) { return this.erroIdAnotacaoNaoInformado(res)}
        const resultsIsComSucesso = this.anotacaoPacienteService.visualizarAnotacao(body)

        if(!resultsIsComSucesso){
            return res.status(HttpStatus.BAD_REQUEST.code).json({ mensagem: "Nao foi possivel atualizar anotacao para visualizada, id: " + body.idAnotacao});    
        }

        return res.status(HttpStatus.OK.code).json({ mensagem: "Registro atualizado, id: " + body.idAnotacao});
    }

    public async getTituloAnotacaoByDescricao(req: Request, res: Response): Promise<Response> {
        try {
            const descricao = req.query.descricao as string;

            console.log("parametros: ", descricao)
            const tituloGerado : string = await this.anotacaoPacienteService.obterTituloAnotacaoPorIA(descricao)

            return res.status(HttpStatus.OK.code).json({ tituloGerado });
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao gerar novo titulo', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Falha ao gerar titulo da mensagem." , statusReturn.description));
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
