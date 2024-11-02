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


    async salvarAnoacaoPaciente(anotacaoParaSalvar: AnotacaoPacienteModel): Promise<number | undefined> {
        try {
            const novaAnotacao = await AnotacaoPacienteModel.create({
                descricao: anotacaoParaSalvar.descricao,
                dhRegistro: new Date(), 
                fk_idPaciente: anotacaoParaSalvar.fk_idPaciente, 
            });
            
            return novaAnotacao.idAnotacao;
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
        }
    }

}
