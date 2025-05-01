
enum Routes{
    PSICOLOGO = "/psicologo",
    PACIENTE = "/paciente",
    ATIVIDADE_PACIENTE = "/atividade",
    ANOTACAO_PACIENTE  = "/anotacao"
}

export const Endpoints = {
    'PSICOLOGO' : {
        "basePath" : Routes.PSICOLOGO,
        "getUsuariosPsicologos" :  "/all",
        "getPsicologoById" : "/buscarPsicologo",
        "vincularPacienteById" : "/vincularPaciente",
    },
    'PACIENTE' : {
        "basePath" : Routes.PACIENTE,
        "getUsuariosPaciente" : "/all",
        "getPacienteById" : "/buscarPaciente",
        "getPacientesByIdProfissional" : "/buscarPacientePorProfissional",
        "deleteContaPaciente" : "/deletarPacienteById",
    },
    'ATIVIDADES' : {
        "basePath" : Routes.ATIVIDADE_PACIENTE,
        "getAllAtividades" : "/all",        
        "getAtividadeById" : "/buscarAtividade",
        "getAtividadesByIdPaciente" : "/buscarAtividadesPorPaciente"
    },'ANOTACOES' : {
        "basePath" : Routes.ANOTACAO_PACIENTE,
        "getAllAnotacoes" : "/all",
        "getAnotacaoPorIdPaciente" : "/buscarAnotacaoPorIdPaciente",
        "postAnotacao" : "/registrarAnotacao",
        "getAnotacoesByFiltros" : "/filtrar",
        "postVisualizarAnotacao" : "/anotacaoVisualizada"
    },
    'TESTES':{
        "pingApi" : "/"
    }
}