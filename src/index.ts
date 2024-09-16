import express from 'express';
import dotenv from 'dotenv';
import { Endpoints } from './enums/Paths';
import { Routes } from './enums/Routes';
// import mysql from 'mysql2';

dotenv.config();

const Api = express();
const port = process.env.PORT || 3000;

Api.use(express.json());


Api.use(Endpoints.PSICOLOGO.basePath, Routes.PsicologoRouter)
Api.use(Endpoints.PACIENTE.basePath, Routes.PacienteRouter)
Api.use(Endpoints.TASK.basePath, Routes.TaskResrouce)

Api.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`,'\n para testar: curl http://localhost:3000/');
});

export default Api;

