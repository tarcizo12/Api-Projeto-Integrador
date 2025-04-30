import { Request, Response } from 'express';
import HttpStatus from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { Parametros } from '../enums/Parametros';
import { AnotacaoPacienteService } from '../service/AnotacaoPacienteService';
import { AnotacaoPacienteInterface } from '../interfaces/AnotacaoPacienteInterface';
import { AnotacaoPacienteModel } from '../model/AnotacaoPacienteModel';
import { FiltroAnotacoes } from '../model/FiltroAnotacoes';


/**
 * Classe de controlle de aplicacao
 */
export default class AnotacaoPacienteController {
    private anotacaoPacienteService: AnotacaoPacienteInterface = new AnotacaoPacienteService; 

    public async getAnotacaoPorIdPaciente(req: Request, res: Response): Promise<Response> {
        const idPaciente: string = StringUtil.getQueryString(req.query, Parametros.ID_PACIENTE);
        if (!idPaciente) { return this.erroIdPacienteNaoInformado(res)}

        return res.status(HttpStatus.OK.code).json(await this.anotacaoPacienteService.listarAntacoesPorIdPaciente(Number(idPaciente)));
    }

    public async postAnotacao(req: Request, res: Response): Promise<Response> {
        const body: AnotacaoPacienteModel = req.body

        const idPaciente: number = body._fk_idPaciente

        if (!idPaciente) { return this.erroIdPacienteNaoInformado(res)}
        const idAnotacaoRegistrada = await this.anotacaoPacienteService.salvarAnoacaoPaciente(body)

        if(idAnotacaoRegistrada === undefined){
            return res.status(HttpStatus.BAD_REQUEST.code).json({ mensagem: "Nao foi possivel gerar novo registro de anotacao"});    
        }

        return res.status(HttpStatus.OK.code).json({ idAnotacaoRegistrada});
    }

    public async getAnotacoesPorFiltro(req: Request, res: Response): Promise<Response> {
        try {
            const filtros: FiltroAnotacoes = req.body.filtros;
            
            const anotacoesFiltradas = await this.anotacaoPacienteService.consultarAnotacoesComFiltro(filtros);
            
            console.log("registros Filtrados: ", anotacoesFiltradas)
            return res.status(HttpStatus.OK.code).json("");
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes relacionados a esse psicologo:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes desse profissional" , statusReturn.description));
        }
    }
    

    private erroIdPacienteNaoInformado = (res: Response) => {
        
        return res.status(HttpStatus.BAD_REQUEST.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar anotacao", "Id do paciente obrigatorio"));   
    }
}
