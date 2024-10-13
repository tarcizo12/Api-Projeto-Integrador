import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage'
import { PsicologoService } from '../service/PsicologoService';
import { StringUtil } from '../utils/StringUtil';
import { Parametros } from '../enums/Parametros';


//Classe de implementação dos contratos
export class PsicologoController{

    private psicologoService: PsicologoService = new PsicologoService;


    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.OK.code).json(await this.psicologoService.listarTodosPsicologos()); 
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar psicólogos:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar psicólogos", statusReturn.description)); 
        }
    }

    
    public async getPsicologoById(req: Request, res: Response): Promise<Response> {
        try {
            const idPsicologo: string = StringUtil.getQueryString(req.query, Parametros.ID_PSICOLOGO);
     
            if (!idPsicologo) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do psicologo é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.psicologoService.buscarPsicologoById(Number(idPsicologo)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar profissionall', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar profissionall" , statusReturn.description));
        }
    }
}