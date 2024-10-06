import { Request, Response } from 'express';
import { PsicologoModel } from '../model/PsicologoModel';
import { PacienteModel } from '../model/PacienteModel';
import { HttpStatus } from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';

export class PsicologoController {

    /**
     * Método para Buscar todos os usuários pacientes
     * @return Promise<Response>
     */
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const psicologos: PsicologoModel[] = await PsicologoModel.findAll()
            return res.status(HttpStatus.OK.code).json(psicologos); 
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar psicólogos:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar psicólogos", statusReturn.description)); 
        }
    }

    /**
     * Método para Buscar todos os pacientes do profissional
     * @return Promise<Response>
     */
    public async listarPacientes(req: Request, res: Response): Promise<Response> {
        try {
            const fk_idProfissional = req.query.idPsicologo;

            if (!fk_idProfissional) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do profissional é obrigatório' });
            }

            const pacientes: PacienteModel[] = await PacienteModel.findAll({where: {fk_idProfissional} });

            return res.status(HttpStatus.OK.code).json(pacientes);
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes relacionados a esse psicologo:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes desse profissional" , statusReturn.description));
        }
    }

}
