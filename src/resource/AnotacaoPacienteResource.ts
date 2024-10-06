import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";


const AnotacaoPacienteResource = Router();

/**
 * Método para Buscar todas as atividades do paciente
 */
AnotacaoPacienteResource.get(Endpoints.ATIVIDADES.getAllAtividades, (req: Request, res: Response) => {
  res.send('Esses são todas as atividades no banco: ... TODO');
});



export default AnotacaoPacienteResource;