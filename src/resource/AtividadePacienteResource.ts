import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";


const AtividadePacienteResource = Router();

/**
 * Método para Buscar todas as atividades do paciente
 */
AtividadePacienteResource.get(Endpoints.ATIVIDADES.getAllAtividades, (req: Request, res: Response) => {
  res.send('Esses são todas as atividades no banco: ... TODO');
});



export default AtividadePacienteResource;