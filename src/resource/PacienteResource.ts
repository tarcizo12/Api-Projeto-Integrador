import Api from "..";
import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";


const PacienteResource = Router();

/**
 * Método para Buscar todos os usuários pacientes
 */
PacienteResource.get(Endpoints.PACIENTE.getUsuariosPaciente, (req: Request, res: Response) => {
  res.send('Esses são todos os usuários pacientes: ... TODO');
});



export default PacienteResource;