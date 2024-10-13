
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
    },
    'PACIENTE' : {
        "basePath" : Routes.PACIENTE,
        "getUsuariosPaciente" : "/all",
        "getPacienteById" : "/buscarPaciente",
        "getPacientesByIdProfissional" : "/buscarPacientePorProfissional"
    },
    'ATIVIDADES' : {
        "basePath" : Routes.ATIVIDADE_PACIENTE,
        "getAllAtividades" : "/all",        
        "getAtividadeById" : "/buscarAtividade",
        "getAtividadesByIdPaciente" : "/buscarAtividadesPorPaciente"
    },'ANOTACOES' : {
        "basePath" : Routes.ANOTACAO_PACIENTE,
        "getAllAnotacoes" : "/all"
    },
    'TESTES':{
        "pingApi" : "/"
    }
}