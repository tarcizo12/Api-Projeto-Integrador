import { Request, Response } from "express";
import { PacienteServiceInterface } from "../interfaces/PacienteServiceInterface";
import { PacienteModel } from "../model/PacienteModel";
import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AnotacaoPacienteModel } from "../model/AnotacaoPacienteModel";


//Classe de implementação dos contratos
export class AnotacaoPacienteService implements AnotacaoPacienteInterface{

    listarAntacoesPorIdPaciente(fk_idPaciente: number): Promise<AnotacaoPacienteModel[]> {
        try {
            return AnotacaoPacienteModel.findAll({where: {fk_idPaciente} });
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter as anotacoes desse paciente" + errorMessage);
        }
    }


    salvarAnoacaoPaciente(pacienteParaSalvar: PacienteModel): Promise<number> {
        throw new Error("Method not implemented.");//TODO
    }

}
