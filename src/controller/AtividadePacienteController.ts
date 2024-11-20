import { Request, Response } from 'express';
import HttpStatus  from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { Parametros } from '../enums/Parametros';
import { AtividadePacienteService } from '../service/AtividadePacienteService';
import { AtividadesPacienteInterface } from '../interfaces/AtividadesPacienteInterface';


/**
 * Classe de controlle de aplicacao
 */
export class AtividadePacienteController {
    private atividadePacienteService: AtividadesPacienteInterface = new AtividadePacienteService; 

    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.OK.code).json(await this.atividadePacienteService.listarTodasAtividades()); 
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar atividades:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar atividades", statusReturn.description)); 
        }
    }
 

    public async getAtividadeById(req: Request, res: Response): Promise<Response> {
        try {
            const idAtividade: string = StringUtil.getQueryString(req.query, Parametros.ID_ATIVIDADE);
     
            if (!idAtividade) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID da atividade é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.atividadePacienteService.buscarAtividadeById(Number(idAtividade)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar atividade POR ID:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar atividade POR ID: " , statusReturn.description));
        }
    }

    public async getAtividadesPorPaciente(req: Request, res: Response): Promise<Response> {
        try {
            const fkIdPaciente: string = StringUtil.getQueryString(req.query, Parametros.ID_PACIENTE);
   
            if (!fkIdPaciente) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do paciente é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.atividadePacienteService.buscarAtividadesByIdPaciente(Number(fkIdPaciente)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar atividades relacionadas a esse paciente', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar atividades relacionadas a esse paciente" , statusReturn.description));
        }
    }
}
