import { Request, Response, Router } from 'express';
import { Endpoints } from "../enums/Paths";

export class AnotacaoPacienteResource {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Inicializa as rotas associadas às anotações do paciente.
   */
  private initializeRoutes(): void {
    this.router.get(
      Endpoints.ATIVIDADES.getAllAtividades,
      (req: Request, res: Response) => this.getAllAnotacoes(req, res)
    );
  }


  private async getAllAnotacoes(req: Request, res: Response): Promise<Response> {
    return res.send('Essas são todas as atividades no banco: ... TODO');
  }

  public getRouter(): Router { return this.router}
}

export default new AnotacaoPacienteResource().getRouter();
