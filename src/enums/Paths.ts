
enum Routes{
    PSICOLOGO = "/psicologo",
    PACIENTE = "/paciente",
    ATIVIDADE_PACIENTE = "/atividade",
    ANOTACAO_PACIENTE  = "/anotacao",
    LOGIN  = "/login"
}

export const Endpoints = {
    'PSICOLOGO' : {
        "basePath" : Routes.PSICOLOGO,
        "getUsuariosPsicologos" :  "/all",
        "getPsicologoById" : "/buscarPsicologo",
        "vincularPacienteById" : "/vincularPaciente",
        "atualizarPerfil" : "/atualizarPerfil",
        "deleteContaPsicologo" : "/deletarConta",
    },
    'PACIENTE' : {
        "basePath" : Routes.PACIENTE,
        "getUsuariosPaciente" : "/all",
        "getPacienteById" : "/buscarPaciente",
        "getPacientesByIdProfissional" : "/buscarPacientePorProfissional",
        "deleteContaPaciente" : "/deletarPacienteById",
        "desvincularPsicologo" : "/desvincularPsicologo",
        "vincularPsicologo" : "/vincularPsicologo",
        "atualizarPerfil" : "/atualizarPerfil",
        "deleteContaPropria" : "/deletarConta",
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
        "putAnotacao" : "/atualizarAnotacao",
        "deleteAnotacao" : "/deletarAnotacao",
        "getAnotacoesByFiltros" : "/filtrar",
        "postVisualizarAnotacao" : "/anotacaoVisualizada",
        "getTituloAnotacao": "/obterTitulo",
        "getResumoSemanal" : "/obterResumo"
    },
    'LOGIN':{
        "basePath" : Routes.LOGIN,
        "realizarLogin" : "/login",
        "realizarCadastro" : "/cadastrar",
        "solicitarCodigoRecuperacao" : "/solicitarCodigoRecuperacao",
        "redefinirSenhaComCodigo" : "/redefinirSenhaComCodigo",
        "trocarSenha" : "/trocarSenha",
    },
    'TESTES':{
        "pingApi" : "/"
    }
}