import { Request, Response, Router } from 'express';
import { PsicologoController } from '../controller/PsicologoController'; 
import { Endpoints } from "../enums/Paths";
import { authenticateToken } from '../middlewares/authMiddleware';

export class PsicologoResource {
  private router: Router;
  private psicologoController: PsicologoController;

  constructor() {
    this.router = Router();
    this.psicologoController = new PsicologoController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get(
      Endpoints.PSICOLOGO.getUsuariosPsicologos,
      (req: Request, res: Response) => this.psicologoController.getAll(req, res)
    );

    this.router.get(
      Endpoints.PSICOLOGO.getPsicologoById,
      (req: Request, res: Response) => this.psicologoController.getPsicologoById(req, res)
    );

    this.router.post(
      Endpoints.PSICOLOGO.vincularPacienteById,
      (req: Request, res: Response) => this.psicologoController.postVincularClienteById(req, res)
    );

    this.router.put(
      Endpoints.PSICOLOGO.atualizarPerfil,
      (req: Request, res: Response) => this.psicologoController.atualizarPerfil(req, res)
    );

    this.router.delete(
      Endpoints.PSICOLOGO.deleteContaPsicologo,
      (req: Request, res: Response) => this.psicologoController.deletarConta(req, res)
    );
  }

  public getRouter(): Router { return this.router}
}

export default new PsicologoResource().getRouter();
