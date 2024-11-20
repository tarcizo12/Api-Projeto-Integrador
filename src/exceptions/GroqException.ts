export default class GroqException extends Error {
    public readonly code: string;
    public readonly details?: any;

    constructor(message: string, code: string, details?: any) {
        super(message); // Mensagem do erro
        this.name = this.constructor.name; // Nome da classe de erro
        this.code = code; // Código do erro
        this.details = details; // Detalhes opcionais para contexto adicional

        // Necessário para herdar de Error em versões antigas do TypeScript
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
