import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AnotacaoPacienteModel } from "../model/AnotacaoPacienteModel";
import {analyzeEmotionFromMessage} from '../groq/GroqConfig'

//Classe de implementação dos contratos
export class AnotacaoPacienteService implements AnotacaoPacienteInterface{


    async obterEmocaoDescricaoAnotacao(descricaoAnotacao: string): Promise<string> {
        try {
            console.log(`Mensagem de teste: "${descricaoAnotacao}"`);
            
            const emotion = await analyzeEmotionFromMessage(descricaoAnotacao);
            
            console.log('Análise de emoção retornada:');
            console.log(emotion);
    
            return emotion; 
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            console.error('Erro ao testar a análise de emoção:');
            console.error(`Mensagem de erro: ${err.message}`);
    
            
            throw new Error('Não foi possível analisar a emoção. Por favor, tente novamente.');
        }
    }
    

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
