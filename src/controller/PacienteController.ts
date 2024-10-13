import { Request, Response } from 'express';
import { PsicologoModel } from '../model/PsicologoModel';
import { PacienteModel } from '../model/PacienteModel';
import { HttpStatus } from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { PacienteService } from '../service/PacienteService';
import { Parametros } from '../enums/Parametros';


//Classe de implementação dos contratos
export class PacienteController {
    private pacienteService: PacienteService = new PacienteService;

    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.OK.code).json(await this.pacienteService.listarTodosPacientes()); 
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar psicólogos:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes", statusReturn.description)); 
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
