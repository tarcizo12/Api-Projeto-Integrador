import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";
import { PacienteController } from '../controller/PacienteController';

export class PacienteResource {
  private router: Router;
  private pacienteController: PacienteController;


  constructor() {
    this.router = Router();
    this.initializeRoutes();
    this.pacienteController = new PacienteController();
  }

  /**
   * Inicializa as rotas associadas aos recursos de Paciente.
   */
  private initializeRoutes(): void {
    this.router.get(
      Endpoints.PACIENTE.getUsuariosPaciente,
      (req: Request, res: Response) => this.pacienteController.getAll(req, res)
    );

    this.router.get(
      Endpoints.PACIENTE.getPacienteById,
      (req: Request, res: Response) => this.pacienteController.getPacienteById(req, res)
    );

    this.router.get(
      Endpoints.PACIENTE.getPacientesByIdProfissional,
      (req: Request, res: Response) => this.pacienteController.getPacientesPorProfssional(req, res)
    );

    this.router.delete(
      Endpoints.PACIENTE.deleteContaPaciente,
      (req: Request, res: Response) => this.pacienteController.deletePacienteById(req, res)
    );
  }


  public getRouter(): Router { return this.router}
}

export default new PacienteResource().getRouter();
