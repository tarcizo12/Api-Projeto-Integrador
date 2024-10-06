import { Request, Response, Router } from 'express';
import { PsicologoController } from '../controller/PsicologoController'; 
import { Endpoints } from "../enums/Paths";

const PsicologoResource = Router();
const psicologoController = new PsicologoController();

/**
 * Método para buscar todos os usuários psicólogos
 */
PsicologoResource.get(Endpoints.PSICOLOGO.getUsuariosPsicologos, (req: Request, res: Response) => {
  return psicologoController.getAll(req, res); 
});

export default PsicologoResource;
