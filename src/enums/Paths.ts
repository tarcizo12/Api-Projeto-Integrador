
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
        "listarPacientes" : "/listarPacientes"
    },
    'PACIENTE' : {
        "basePath" : Routes.PACIENTE,
        "getUsuariosPaciente" : "/all"
    },
    'ATIVIDADES' : {
        "basePath" : Routes.ATIVIDADE_PACIENTE,
        "getAllAtividades" : "/all"
    },'ANOTACOES' : {
        "basePath" : Routes.ANOTACAO_PACIENTE,
        "getAllAnotacoes" : "/all"
    },
    'TESTES':{
        "pingApi" : "/"
    }
}