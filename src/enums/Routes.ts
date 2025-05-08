import PacienteResource from "../resource/PacienteResource";
import PsicologoResource from "../resource/PsicologoResource";
import AtividadePacienteResource from "../resource/AtividadePacienteResource";
import AnotacaoPacienteResource from "../resource/AnotacaoPacienteResource";
import LoginResource from "../resource/LoginResource";

const Routes = { 
    'PsicologoRouter' : PsicologoResource,
    'PacienteRouter' : PacienteResource,
    'AtividadePacienteResource' : AtividadePacienteResource,
    'AnotacaoPacienteResource' : AnotacaoPacienteResource,
    'LoginResource' : LoginResource
}

export default Routes