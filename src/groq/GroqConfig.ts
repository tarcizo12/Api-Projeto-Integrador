import Groq from 'groq-sdk';
import GroqException from '../exceptions/GroqException';
import dotenv from 'dotenv';
import { getEmocoesConcatenadasString } from '../enums/Emocoes';
import { ValoresProcessadosGroq } from '../model/ValoresProcessadosGroq';

dotenv.config();

const GROQ = new Groq({ apiKey: process.env.GROQ_API_KEY });


/**
 * Método para realizar a analise da emoção da descricao utilziando a i.a do groq
 * @return o string da emocao 
 */
const obterEmocaoDescricaoAnotacao = async (message: string): Promise<ValoresProcessadosGroq> => {
    try {
        const emotionAnalysis = await getEmotionAnalysis(message);
    
        return {titulo: "", emocaoEstimada: emotionAnalysis.emotion};
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
    
        return {titulo: tituloAnalysis.title , emocaoEstimada: ""};
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

const getEmotionAnalysis = async (content: string) =>{
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


const getTituloAnotacao = async (content: string) =>{
    try {
        const response = await GROQ.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `Determine a emoção transmitida na mensagem e use sempre palavras em português. 
                            Retorne somente a propriedade 'title' no formato JSON, com um titulo que descreva brevemente o conteudo da mensagem para  que fique claro o conteudo dela , nao passe de 10 palavras. 
                            Não inclua mais nenhum texto além do JSON com a propriedade 'title' devidamente preenchida, e certifique-se de que as chaves de 
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

        console.error('Erro na análise do titulo da anotacao:', error.message);
        throw new GroqException(
            'Erro ao chamar o modelo para análise.',
            'MODEL_REQUEST_ERROR',
            { originalError: error.message }
        );
    }

}

const testeGroq = async (descricaoAnotacao: string): Promise<void> =>{
    try {
        console.log(`Mensagem de teste: "${descricaoAnotacao}"`);
        
        const emotion = await obterEmocaoDescricaoAnotacao(descricaoAnotacao);
        
        console.log('Análise de emoção retornada:');
        console.log(emotion);

    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Erro ao testar a análise de emoção:');
        console.error(`Mensagem de erro: ${err.message}`);

        
        throw new Error('Não foi possível analisar a emoção. Por favor, tente novamente.');
    }
}

const TestScenarios = {
    UM: "Hoje acordei muito animado para começar um novo projeto no trabalho!",
    DOIS: "Perdi meu ônibus e cheguei atrasado ao trabalho, fiquei muito frustrado.",
    TRES: "Recebi uma notícia incrível: passei no vestibular!",
    QUATRO: "O filme que assisti ontem me deixou muito emocionado e reflexivo.",
    CINCO: "Meu time perdeu a final do campeonato, fiquei triste e desanimado.",
    SEIS: "Recebi um presente inesperado de um amigo, fiquei surpreso e feliz.",
    SETE: "Tive que apresentar um projeto importante na frente de muitas pessoas, fiquei nervoso.",
    OITO: "Aquele cachorro na rua era tão fofo que não consegui parar de sorrir.",
    NOVE: "Hoje esqueci meu guarda-chuva e tomei uma chuva enorme, foi desconfortável.",
    DEZ: "Descobri que meu melhor amigo mentiu para mim, fiquei muito chateado e com raiva.",
};


const executarTeste = (): void =>{
    (async () => {
        try {
            await testeGroq(TestScenarios.UM);
        } catch (error) {
            console.error('Erro ao executar os testes:', error);
        }
    })();
}


//executarTeste()

export {obterEmocaoDescricaoAnotacao , obterTituloAnotacao};