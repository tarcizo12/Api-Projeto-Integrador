export class StringUtil {
    /**
     * Método para extrair um valor de query como string.
     * @param query - O objeto de query da requisição.
     * @param key - A chave cujo valor desejamos extrair.
     * @return string - O valor extraído como string ou uma string vazia se não houver.
     */
    public static getQueryString(query: Record<string, any>, key: string): string {
        const value = query[key];
        if (typeof value === 'string') {
            return value;
        } else if (Array.isArray(value)) {
            return value[0]; // Retorna o primeiro valor se for um array
        }
        return ''; // Retorna uma string vazia se não houver valor
    }
}


