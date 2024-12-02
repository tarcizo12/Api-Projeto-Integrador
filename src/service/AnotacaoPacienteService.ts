import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AnotacaoPacienteModel } from "../model/AnotacaoPacienteModel";
import obterEmocaoDescricaoAnotacao from '../groq/GroqConfig'


/**
 * Classe de implementação dos contratos
 */
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
        const emocaoGerada = (await obterEmocaoDescricaoAnotacao(anotacaoParaSalvar.descricao)).toString()

        try {
            const novaAnotacao = await AnotacaoPacienteModel.create({
                descricao: anotacaoParaSalvar.descricao,
                emocaoEstimada: emocaoGerada,
                dhRegistro: new Date(), 
                fk_idPaciente: anotacaoParaSalvar._fk_idPaciente, 
            });
            
            console.log("Nova anotacao salva: ", novaAnotacao)
            return novaAnotacao.idAnotacao;
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
        }
    }

}
