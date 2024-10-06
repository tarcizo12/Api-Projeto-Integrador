export class ErroBodyMensage {
    /**
     * Retorna o objeto ErroBodyMensage como um JSON.
     */
    public static createErrorBody(message: string, descricaoHttp: string): { message: string, erro: string } {
        return {
            message: message,
            erro: descricaoHttp
        };
    }
}
