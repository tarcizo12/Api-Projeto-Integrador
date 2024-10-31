import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { Parametros } from '../enums/Parametros';
import { AnotacaoPacienteService } from '../service/AnotacaoPacienteService';
import { AnotacaoPacienteInterface } from '../interfaces/AnotacaoPacienteInterface';


//Classe de implementação dos contratos
export default class AnotacaoPacienteController {
    private anotacaoPacienteService: AnotacaoPacienteInterface = new AnotacaoPacienteService; 

    public async getAnotacaoPorIdPaciente(req: Request, res: Response): Promise<Response> {
        const idPaciente: string = StringUtil.getQueryString(req.query, Parametros.ID_PACIENTE);
     
        if (!idPaciente) {
            return res.status(HttpStatus.BAD_REQUEST.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar atividades", "Id do paciente obrigatorio")); 
        }

        return res.status(HttpStatus.OK.code).json(await this.anotacaoPacienteService.listarAntacoesPorIdPaciente(Number(idPaciente)));
    }

    public postAnoacao(req: Request, res: Response): void {
        //TODO
    }
 
}
