import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";
import { PacienteController } from '../controller/PacienteController';
import { authenticateToken } from '../middlewares/authMiddleware';

export class PacienteResource {
  private router: Router;
  private pacienteController: PacienteController;

  constructor() {
    this.router = Router();
    this.pacienteController = new PacienteController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authenticateToken);

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

    this.router.put(
      Endpoints.PACIENTE.desvincularPsicologo,
      (req: Request, res: Response) => this.pacienteController.desvincularPsicologo(req, res)
    );

    this.router.put(
      Endpoints.PACIENTE.vincularPsicologo,
      (req: Request, res: Response) => this.pacienteController.vincularPsicologo(req, res)
    );

    this.router.put(
      Endpoints.PACIENTE.atualizarPerfil,
      (req: Request, res: Response) => this.pacienteController.atualizarPerfil(req, res)
    );

    this.router.delete(
      Endpoints.PACIENTE.deleteContaPropria,
      (req: Request, res: Response) => this.pacienteController.deletarContaPropria(req, res)
    );
  }

  public getRouter(): Router { return this.router}
}

export default new PacienteResource().getRouter();
