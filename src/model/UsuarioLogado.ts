import { PacienteModel } from "./PacienteModel";
import { PsicologoModel } from "./PsicologoModel";

export type UsuarioLogado = {
    isPsicologo : boolean | null ,
    isPaciente : boolean | null, 
    usuarioLogadoData : PacienteModel | PsicologoModel | null
};
