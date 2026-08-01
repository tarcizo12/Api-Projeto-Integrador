import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
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
    this.api.use(helmet());
    this.api.use(express.json({ limit: '1mb' }));

    const allowedOrigins = (process.env.CORS_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    this.api.use(
      cors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
      })
    );
  }

  private initializeRoutes(): void {
    this.api.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        service: 'api-projeto-integrador',
        timestamp: new Date().toISOString(),
      });
    });

    this.api.use(Endpoints.PSICOLOGO.basePath, Routes.PsicologoRouter);
    this.api.use(Endpoints.PACIENTE.basePath, Routes.PacienteRouter);
    this.api.use(Endpoints.ATIVIDADES.basePath, Routes.AtividadePacienteResource);
    this.api.use(Endpoints.ANOTACOES.basePath, Routes.AnotacaoPacienteResource);
    this.api.use(Endpoints.LOGIN.basePath, Routes.LoginResource);
  }

  public listen(): void {
    this.api.listen(this.port, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${this.port}`);
      console.log(`Healthcheck: http://localhost:${this.port}/health`);
    });
  }
}

const server = new Server();
server.listen();

export default server;
