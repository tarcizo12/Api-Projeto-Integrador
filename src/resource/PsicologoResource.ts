import Api from "..";
import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";


const PsicologoResource = Router();

/**
 * Método para Buscar todos os usuários pacientes
 */
PsicologoResource.get(Endpoints.PSICOLOGO.getUsuariosPsicologos, (req: Request, res: Response) => {
  res.send('Esses são todos os usuários psicologos: ... TODO');
});



export default PsicologoResource;