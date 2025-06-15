import Groq from 'groq-sdk';
import GroqException from '../exceptions/GroqException';
import dotenv from 'dotenv';
import { getEmocoesConcatenadasString } from '../enums/Emocoes';
import { ValoresProcessadosGroq } from '../model/ValoresProcessadosGroq';
import { AnotacaoPacienteModel } from '../model/AnotacaoPacienteModel';

dotenv.config();

const GROQ = new Groq({ apiKey: process.env.GROQ_API_KEY });


/**
 * Método para realizar a analise da emoção da descricao utilziando a i.a do groq
 * @return o string da emocao 
 */
const obterEmocaoDescricaoAnotacao = async (message: string): Promise<ValoresProcessadosGroq> => {
    try {
        const emotionAnalysis = await getEmotionAnalysis(message);

        return { titulo: "", emocaoEstimada: emotionAnalysis.emotion };
    } catch (err) {

        const error = err instanceof Error ? err : new Error(String(err));

        console.error('Erro ao analisar a emoção:', error.message);

        throw new GroqException(
            'Ocorreu um erro inesperado.',
            'UNKNOWN_ERROR',
            { originalError: error.message }
        );
    }
}

/**
 * Método para realizar a analise da descricao da anotacao por IA
 * @return o string do titulo
 */
const obterTituloAnotacao = async (descricao: string): Promise<ValoresProcessadosGroq> => {
    try {
        const tituloAnalysis = await getTituloAnotacao(descricao);

        return { titulo: tituloAnalysis.title, emocaoEstimada: "" };
    } catch (err) {

        const error = err instanceof Error ? err : new Error(String(err));

        console.error('Erro ao analisar a emoção:', error.message);

        throw new GroqException(
            'Ocorreu um erro inesperado.',
            'UNKNOWN_ERROR',
            { originalError: error.message }
        );
    }
}

const obterResumoSemanalAnotacoes = async (
    anotacoes: AnotacaoPacienteModel[]
): Promise<string> => {

    const fatosFormatados = anotacoes.map((anotacao, index) => {
        return `(${index + 1}) Emoção: ${anotacao.emocaoEstimada} - Descrição: ${anotacao.descricao}`;
    }).join('\n');

    if (!anotacoes || anotacoes.length === 0) {
        return 'Não houveram anotações para processar na última semana.';
    }

    const prompt = `
        Você é um assistente que analisa registros emocionais de um paciente ao longo da semana.

         Com base nas informações abaixo, gere um **resumo conciso e organizado** dos acontecimentos dos últimos 7 dias.
         Agrupe os eventos semelhantes, destaque padrões emocionais e a evolução ao longo da semana. 
         Use uma linguagem empática e objetiva, com até tres parágrafos.

        Registros:
        ${fatosFormatados}

Resumo:
`;

    try {
        const response = await GROQ.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama3-8b-8192'
        });

        return response.choices[0]?.message?.content?.trim() || 'Resumo não gerado.';
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        console.error('Erro ao gerar resumo semanal:', error.message);
        throw new GroqException(
            'Erro ao gerar o resumo dos registros.',
            'MODEL_REQUEST_ERROR',
            { originalError: error.message }
        );
    }
};


const getEmotionAnalysis = async (content: string) => {
    try {
        const response = await GROQ.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `Determine a emoção transmitida na mensagem e use sempre palavras em português. 
                            Retorne somente a propriedade 'emotion' no formato JSON, com o valor correspondente a uma das 
                            seguintes emoções: ${getEmocoesConcatenadasString()}. 
                            Não inclua mais nenhum texto além do JSON com a propriedade 'emotion' devidamente preenchida, e certifique-se de que as chaves de 
                            abertura e fechamento do JSON estejam sempre presentes. Mensagem: "${content}"`,
                },
            ],
            model: 'llama3-8b-8192',
        });

        const completionContent = response.choices[0]?.message?.content || '';
        const cleanContent = completionContent.replace(/\n/g, '').trim();
        return JSON.parse(cleanContent);
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        console.error('Erro na análise de emoção:', error.message);
        throw new GroqException(
            'Erro ao chamar o modelo para análise.',
            'MODEL_REQUEST_ERROR',
            { originalError: error.message }
        );
    }

}


const getTituloAnotacao = async (content: string) => {
    try {
        const response = await GROQ.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `Determine a emoção transmitida na mensagem e use sempre palavras em português. 
                            Retorne somente a propriedade 'title' no formato JSON, com um titulo que descreva brevemente o conteudo da mensagem para  que fique claro o conteudo dela , nao passe de 10 palavras. 
                            Não inclua mais nenhum texto além do JSON com a propriedade 'title' devidamente preenchida, e certifique-se de que as chaves de 
                            abertura e fechamento do JSON estejam sempre presentes. Mensagem: "${content}. Deve ter no maximo 40 caracteres."`,
                },
            ],
            model: 'llama3-8b-8192',
        });

        const completionContent = response.choices[0]?.message?.content || '';
        const cleanContent = completionContent.replace(/\n/g, '').trim();
        return JSON.parse(cleanContent);
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        console.error('Erro na análise do titulo da anotacao:', error.message);
        throw new GroqException(
            'Erro ao chamar o modelo para análise.',
            'MODEL_REQUEST_ERROR',
            { originalError: error.message }
        );
    }



}

export { obterEmocaoDescricaoAnotacao, obterTituloAnotacao, obterResumoSemanalAnotacoes };