import { Request, Response, Router } from 'express';
import { PsicologoController } from '../controller/PsicologoController'; 
import { Endpoints } from "../enums/Paths";

export class PsicologoResource {
  private router: Router;
  private psicologoController: PsicologoController;


  constructor() {
    this.router = Router();
    this.psicologoController = new PsicologoController();
    this.initializeRoutes();
  }

  /**
   * Inicializa as rotas associadas aos recursos de Psicólogo.
   */
  private initializeRoutes(): void {
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
  }

  public getRouter(): Router { return this.router}
}

export default new PsicologoResource().getRouter();
