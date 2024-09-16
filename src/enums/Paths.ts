
enum Routes{
    PSICOLOGO = "/psicologo",
    PACIENTE = "/paciente",
    TASK = "/task"
}

export const Endpoints = {
    'PSICOLOGO' : {
        "basePath" : Routes.PSICOLOGO,
        "getUsuariosPsicologos" :  "/all"
    },
    'PACIENTE' : {
        "basePath" : Routes.PACIENTE,
        "getUsuariosPaciente" : "/all"
    },
    'TASK' : {
        "basePath" : Routes.TASK,
        "getAllTask" : "/all"
    },
    'TESTES':{
        "pingApi" : "/"
    }
}