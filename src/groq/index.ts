import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.groqApiKey || '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' });

export async function analyzeEmotionFromMessage(message: string) {
    try {
        const emotionAnalysis = await getEmotionAnalysis(message);
        return emotionAnalysis.emotion;
    } catch (error: any) {
        console.error('Erro ao analisar a emoção:', error.message);
        throw error;
    }
}

async function getEmotionAnalysis(content: string) {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: `Determine a emoção transmitida na mensagem e use sempre palavras em português. Retorne somente a propriedade 'emotion' no formato JSON, com o valor correspondente a uma das seguintes emoções: 'Empolgação', 'Excitação', 'Felicidade', 'Tristeza', 'Raiva', 'Medo', 'Surpresa', 'Entusiasmo'. Não inclua mais nenhum texto além do JSON com a propriedade 'emotion' devidamente preenchida, e certifique-se de que as chaves de abertura e fechamento do JSON estejam sempre presentes. Mensagem: "${content}"`,
            },
        ],
        model: 'llama3-8b-8192', // Modelo configurado
    });

    // Parsear a resposta do modelo
    const completionContent = response.choices[0]?.message?.content || '';
    const cleanContent = completionContent.replace(/\n/g, '').trim(); // Remove todas as quebras de linha e espaços extras
    try {
        const parsedResponse = JSON.parse(cleanContent);
        return parsedResponse;
    } catch (error) {
        console.error('Erro ao parsear a resposta da emoção:', error);
        throw new Error('Resposta do modelo não está no formato esperado.');
    }
}
