import { Request, Response } from "express";
import { PacienteServiceInterface } from "../interfaces/PacienteServiceInterface";
import { PsicologoServiceInterface } from "../interfaces/PsicologoServiceInterface";
import { PacienteModel } from "../model/PacienteModel";
import { PsicologoModel } from "../model/PsicologoModel";
import { PacienteService } from "./PacienteService";


//Classe de implementação dos contratos
export class PsicologoService implements PsicologoServiceInterface{

    async buscarPsicologoById(idPsicologo: number): Promise<PsicologoModel> {
        try {
            const psicologo: PsicologoModel | null = await PsicologoModel.findByPk(idPsicologo);

            if (!psicologo) {
                throw new Error("Psicologo não encontrado");
            }

            return psicologo;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter psicologo por ID: " + errorMessage);
        }
    }

    listarTodosPsicologos(): Promise<PsicologoModel[]> {
        return PsicologoModel.findAll();
    }
 
}
