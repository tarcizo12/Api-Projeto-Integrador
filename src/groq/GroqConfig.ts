import Groq from 'groq-sdk';
import GroqException from '../exceptions/GroqException';
import dotenv from 'dotenv';
import { getEmocoesConcatenadasString } from '../enums/Emocoes';
import { ValoresProcessadosGroq } from '../model/ValoresProcessadosGroq';
import { AnotacaoPacienteModel } from '../model/AnotacaoPacienteModel';

dotenv.config();

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const GROQ = new Groq({ apiKey: process.env.GROQ_API_KEY });


/**
 * Método para realizar a analise da emoção da descricao utilziando a i.a do groq
 * @return o string da emocao 
 */
const obterEmocaoDescricaoAnotacao = async (message: string): Promise<ValoresProcessadosGroq> => {
    try {
        const emotionAnalysis = await getEmotionAnalysis(message);
        const emocao = String(emotionAnalysis.emotion || '').trim();

        return { titulo: "", emocaoEstimada: emocao };
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
            model: GROQ_MODEL
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


const extrairJson = (conteudo: string): Record<string, unknown> => {
    const limpo = conteudo.trim();
    try {
        return JSON.parse(limpo);
    } catch {
        const match = limpo.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error('Resposta da IA sem JSON válido.');
        }
        return JSON.parse(match[0]);
    }
};

const getEmotionAnalysis = async (content: string) => {
    try {
        const response = await GROQ.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content:
                        'Você classifica emoções de relatos pessoais em português. Responda apenas JSON válido.',
                },
                {
                    role: 'user',
                    content: `Classifique a emoção predominante do relato abaixo.
Use exatamente uma destas emoções: ${getEmocoesConcatenadasString()}.
Responda somente neste formato: {"emotion":"..."}.

Relato:
"""
${content}
"""`,
                },
            ],
            model: GROQ_MODEL,
            temperature: 0.2,
        });

        const completionContent = response.choices[0]?.message?.content || '';
        return extrairJson(completionContent);
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
                    role: 'system',
                    content: `Você cria títulos curtos para diário emocional.
Regras:
- O título deve refletir o que a pessoa realmente escreveu (fato + sentimento).
- Use palavras do próprio relato quando fizer sentido.
- Evite frases genéricas de autoajuda (ex.: "praticando autocontrole", "superando desafios").
- Não invente acontecimentos que não estão no texto.
- Português do Brasil, tom humano e simples.
- No máximo 8 palavras.
- Responda somente JSON válido no formato {"title":"..."}`,
                },
                {
                    role: 'user',
                    content: `Crie um título fiel a este relato:

"""
${content}
"""`,
                },
            ],
            model: GROQ_MODEL,
            temperature: 0.35,
        });

        const completionContent = response.choices[0]?.message?.content || '';
        const parsed = extrairJson(completionContent);
        const title = String(parsed.title || '').trim();
        if (!title) {
            throw new Error('Título vazio retornado pela IA.');
        }
        return { title };
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