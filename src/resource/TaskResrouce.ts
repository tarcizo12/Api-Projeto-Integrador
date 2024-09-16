import Api from "..";
import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";


const TaskResource = Router();

/**
 * Método para Buscar todos os usuários pacientes
 */
TaskResource.get(Endpoints.TASK.getAllTask, (req: Request, res: Response) => {
  res.send('Esses são todas as atividades no banco: ... TODO');
});



export default TaskResource;