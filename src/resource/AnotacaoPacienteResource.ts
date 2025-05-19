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

    this.router.get(
      Endpoints.ANOTACOES.getTituloAnotacao,
      (req: Request, res: Response) => this.anotacaoPacienteController.getTituloAnotacaoByDescricao(req, res)
    );

    this.router.post(
      Endpoints.ANOTACOES.postAnotacao,
      (req: Request, res: Response) => this.anotacaoPacienteController.postAnotacao(req, res)
    );

    this.router.post(
      Endpoints.ANOTACOES.getAnotacoesByFiltros,
      (req: Request, res: Response) => this.anotacaoPacienteController.getAnotacoesPorFiltro(req, res)
    );

    this.router.post(
      Endpoints.ANOTACOES.postVisualizarAnotacao,
      (req: Request, res: Response) => this.anotacaoPacienteController.visualizarAnotacao(req, res)
    );
  }


  public getRouter(): Router { return this.router}
}

export default new AnotacaoPacienteResource().getRouter();
