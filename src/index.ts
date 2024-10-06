import express from 'express';
import dotenv from 'dotenv';
import { Endpoints } from './enums/Paths';
import { Routes } from './enums/Routes';

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
  }

  private initializeRoutes(): void {
    this.api.use(Endpoints.PSICOLOGO.basePath, Routes.PsicologoRouter);
    this.api.use(Endpoints.PACIENTE.basePath, Routes.PacienteRouter);
    this.api.use(Endpoints.ATIVIDADES.basePath, Routes.AtividadePacienteResource);
    this.api.use(Endpoints.ANOTACOES.basePath, Routes.AnotacaoPacienteResource);
  }

  public listen(): void {
    this.api.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`, '\n para testar: curl http://localhost:3000/');
    });
  }
}


const server = new Server();
server.listen();

export default server;
