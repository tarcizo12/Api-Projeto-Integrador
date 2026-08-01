import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";
import { AtividadePacienteController } from '../controller/AtividadePacienteController';

export class AtividadePacienteResource {
  private router: Router;
  private atividadePacienteController: AtividadePacienteController = new AtividadePacienteController;
  
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Inicializa as rotas associadas às atividades do paciente.
   */
  private initializeRoutes(): void {
    this.router.get(
      Endpoints.ATIVIDADES.getAllAtividades,
      (req: Request, res: Response) => this.atividadePacienteController.getAll(req, res)
    );

    this.router.get(
      Endpoints.ATIVIDADES.getAtividadeById,
      (req: Request, res: Response) => this.atividadePacienteController.getAtividadeById(req, res)
    );

    this.router.get(
      Endpoints.ATIVIDADES.getAtividadesByIdPaciente,
      (req: Request, res: Response) => this.atividadePacienteController.getAtividadesPorPaciente(req, res)
    );
  }


  public getRouter(): Router { return this.router}
}

export default new AtividadePacienteResource().getRouter();
