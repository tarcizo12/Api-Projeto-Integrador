import { Request, Response } from 'express';
import  HttpStatus  from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { PacienteService } from '../service/PacienteService';
import { Parametros } from '../enums/Parametros';
import { PacienteServiceInterface } from '../interfaces/PacienteServiceInterface';

/**
 * Classe de controlle de aplicacao
 */
export class PacienteController {
    private pacienteService: PacienteServiceInterface = new PacienteService;

    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.OK.code).json(await this.pacienteService.listarTodosPacientes()); 
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes", statusReturn.description)); 
        }
    }

    public async deletePacienteById(req: Request, res: Response): Promise<Response> {
        try {
            const idPacienteParam = req.query.idPaciente;
    
            if (!idPacienteParam) {
                return res.status(HttpStatus.BAD_REQUEST.code).json(
                    ErroBodyMensage.createErrorBody("O parâmetro 'idPaciente' é obrigatório.", HttpStatus.BAD_REQUEST.description)
                );
            }
    
            const idPaciente = Number(idPacienteParam);
    
            if (isNaN(idPaciente)) {
                return res.status(HttpStatus.BAD_REQUEST.code).json(
                    ErroBodyMensage.createErrorBody("O parâmetro 'idPaciente' deve ser um número.", HttpStatus.BAD_REQUEST.description)
                );
            }
    
            const pacienteDeletado = await this.pacienteService.deletarPacienteById(idPaciente);
    
            return res.status(HttpStatus.OK.code).json({mensagem : `Paciente ${pacienteDeletado.nome} deletado com sucesso`});
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;
    
            console.error('Erro ao deletar paciente:', error);
            return res.status(statusReturn.code).json(
                ErroBodyMensage.createErrorBody("Erro ao deletar paciente", statusReturn.description)
            );
        }
    }
    

    public async getPacienteById(req: Request, res: Response): Promise<Response> {
        try {
            const idPaciente: string = StringUtil.getQueryString(req.query, Parametros.ID_PACIENTE);
     
            if (!idPaciente) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do paciente é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.pacienteService.buscarPacienteById(Number(idPaciente)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes relacionados a esse psicologo:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes desse profissional" , statusReturn.description));
        }
    }

    public async getPacientesPorProfssional(req: Request, res: Response): Promise<Response> {
        try {
            const fkIdProfissional: string = StringUtil.getQueryString(req.query, Parametros.ID_PSICOLOGO);
   
            if (!fkIdProfissional) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do profissional é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.pacienteService.buscarPacientesByIdPsicologo(Number(fkIdProfissional)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes relacionados a esse psicologo:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes desse profissional" , statusReturn.description));
        }
    }
}
