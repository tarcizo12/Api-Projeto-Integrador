import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";
import AnotacaoPacienteController from '../controller/AnotacaoPacienteController'

export class AnotacaoPacienteResource {
  private router: Router;
  private anotacaoPacienteController: AnotacaoPacienteController = new AnotacaoPacienteController;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Inicializa as rotas associadas às anotações do paciente.
   */
  private initializeRoutes(): void {
    this.router.get(
      Endpoints.ANOTACOES.getAnotacaoPorIdPaciente,
      (req: Request, res: Response) => this.anotacaoPacienteController.getAnotacaoPorIdPaciente(req, res)
    );
  }


  public getRouter(): Router { return this.router}
}

export default new AnotacaoPacienteResource().getRouter();
