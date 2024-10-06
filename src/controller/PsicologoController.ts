import { Request, Response } from 'express';
import { PsicologoModel } from '../model/PsicologoModel';

export class PsicologoController {

    /**
     * Método para Buscar todos os usuários pacientes
     * @return Promise<Response>
     */
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const psicologos = await PsicologoModel.findAll()
            return res.status(200).json(psicologos); 
        } catch (error) {
            console.error('Erro ao buscar psicólogos:', error);
            return res.status(500).json({ message: 'Erro ao buscar psicólogos' }); 
        }
    }
}
