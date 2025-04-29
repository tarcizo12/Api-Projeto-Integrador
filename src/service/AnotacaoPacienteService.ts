import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AnotacaoPacienteModel } from "../model/AnotacaoPacienteModel";
import obterEmocaoDescricaoAnotacao from '../groq/GroqConfig'
import { title } from "process";


/**
 * Classe de implementação dos contratos
 */
export class AnotacaoPacienteService implements AnotacaoPacienteInterface{

    
    listarAntacoesPorIdPaciente(fk_idPaciente: number): Promise<AnotacaoPacienteModel[]> {
        try {
            return AnotacaoPacienteModel.findAll({
                where: { fk_idPaciente },
                order: [['idAnotacao', 'DESC']] 
            });
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Erro desconhecido';
            throw new Error("Não foi possível obter as anotações desse paciente: " + errorMessage);
        }
    }
    

    async salvarAnoacaoPaciente(anotacaoParaSalvar: AnotacaoPacienteModel): Promise<number | undefined> {
        const { titulo, emocaoEstimada } = await obterEmocaoDescricaoAnotacao(anotacaoParaSalvar.descricao);

        try {
            const objetoParaSalvar = {
                descricao: anotacaoParaSalvar.descricao,
                emocaoEstimada,
                titulo,
                dhRegistro: new Date(), 
                fk_idPaciente: anotacaoParaSalvar._fk_idPaciente, 
            }
            
            const novaAnotacao = await AnotacaoPacienteModel.create(objetoParaSalvar);
            
            console.log("Nova anotacao salva: ", novaAnotacao)
            return novaAnotacao.idAnotacao;
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
            return undefined;
        }
    }

}
