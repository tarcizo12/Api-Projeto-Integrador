import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Importação do middleware CORS
import { Endpoints } from './enums/Paths';
import Routes from './enums/Routes';

dotenv.config();

class Server {
  private api: express.Application;
  private port: number;

  constructor() {
    this.api = express();
    this.port = Number(process.env.PORT) || 3000;
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.api.use(express.json());

  
    this.api.use(cors({
      origin: ['http://localhost:8081', 'http://192.168.0.5:8081'], 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
      credentials: true, 
    }));
  }

  private initializeRoutes(): void {
    this.api.use(Endpoints.PSICOLOGO.basePath, Routes.PsicologoRouter);
    this.api.use(Endpoints.PACIENTE.basePath, Routes.PacienteRouter);
    this.api.use(Endpoints.ATIVIDADES.basePath, Routes.AtividadePacienteResource);
    this.api.use(Endpoints.ANOTACOES.basePath, Routes.AnotacaoPacienteResource);
  }

  public listen(): void {
    this.api.listen(this.port, () => {
      console.log(
        `Servidor rodando na porta ${this.port}`,
        '\nPara testar: curl http://localhost:3000/'
      );
    });
  }
}

const server = new Server();
server.listen();

export default server;
