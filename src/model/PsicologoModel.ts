class PsicologoModel implements PessoaInterface {
    private _id: number;
    private _Nome: string;
    private _Sexo: string;
    private _CPF: string;
    private _DataNascimento: Date;
    private _Celular: string;
    private _email: string;
  
    constructor(id: number, Nome: string, Sexo: string, CPF: string, DataNascimento: Date, Celular: string, email: string) {
      this._id = id;
      this._Nome = Nome;
      this._Sexo = Sexo;
      this._CPF = CPF;
      this._DataNascimento = DataNascimento;
      this._Celular = Celular;
      this._email = email;
    }
  
    // Getter e Setter para ID
    get id(): number {
      return this._id;
    }
  
    set id(value: number) {
      this._id = value;
    }
  
    // Getter e Setter para Nome
    get Nome(): string {
      return this._Nome;
    }
  
    set Nome(value: string) {
      this._Nome = value;
    }
  
    // Getter e Setter para Sexo
    get Sexo(): string {
      return this._Sexo;
    }
  
    set Sexo(value: string) {
      this._Sexo = value;
    }
  
    // Getter e Setter para CPF
    get CPF(): string {
      return this._CPF;
    }
  
    set CPF(value: string) {
      this._CPF = value;
    }
  
    // Getter e Setter para DataNascimento
    get DataNascimento(): Date {
      return this._DataNascimento;
    }
  
    set DataNascimento(value: Date) {
      this._DataNascimento = value;
    }
  
    // Getter e Setter para Celular
    get Celular(): string {
      return this._Celular;
    }
  
    set Celular(value: string) {
      this._Celular = value;
    }
  
    // Getter e Setter para email
    get email(): string {
      return this._email;
    }
  
    set email(value: string) {
      this._email = value;
    }
  }
  