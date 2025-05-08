import { Request, Response, Router } from 'express';; 
import { Endpoints } from "../enums/Paths";
import { LoginController } from '../controller/LoginController';

export class LoginResource {
  private router: Router;
  private loginController: LoginController;


  constructor() {
    this.router = Router();
    this.loginController = new LoginController();
    this.initializeRoutes();
  }

  /**
   * Inicializa as rotas associadas aos recursos do logoin.
   */
  private initializeRoutes(): void {
    this.router.post(
      Endpoints.LOGIN.realizarLogin,
      (req: Request, res: Response) => this.loginController.postLoginUsuario(req, res)
    );

  }

  public getRouter(): Router { return this.router}
}

export default new LoginResource().getRouter();
