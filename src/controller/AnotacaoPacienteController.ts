import { Request, Response } from 'express';
import HttpStatus from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { Parametros } from '../enums/Parametros';
import { AnotacaoPacienteService } from '../service/AnotacaoPacienteService';
import { AnotacaoPacienteInterface } from '../interfaces/AnotacaoPacienteInterface';
import { AnotacaoPacienteModel } from '../model/AnotacaoPacienteModel';


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

        return res.status(HttpStatus.OK.code).json({ idAnotacaoRegistrada});
    }
    

    private erroIdPacienteNaoInformado = (res: Response) => {
        
        return res.status(HttpStatus.BAD_REQUEST.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar anotacao", "Id do paciente obrigatorio"));   
    }
}
