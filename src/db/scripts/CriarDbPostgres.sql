-- Tabela Psicologo
-- CRIAR A TABELA NO ESQUEMA PUBLIC EXPLÍCITAMENTE
CREATE TABLE IF NOT EXISTS public."Psicologo" (
    "idProfissional" SERIAL PRIMARY KEY NOT NULL,
    "Nome" VARCHAR(255) NOT NULL,
    "CPF" VARCHAR(11) NOT NULL,
    "CRP" VARCHAR(15),
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "Senha" VARCHAR(255) NOT NULL
);

-- Tabela Paciente
CREATE TABLE IF NOT EXISTS public."Paciente" (
    "idPaciente" SERIAL PRIMARY KEY NOT NULL,
    "Nome" VARCHAR(255) NOT NULL,
    "Data_Nascimento" DATE NOT NULL,
    "CPF" VARCHAR(11) NOT NULL,
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "NomeDoResponsavel" VARCHAR(255),
    "Telefone" BIGINT,
    "Senha" VARCHAR(255) NOT NULL,
    "fk_idProfissional" INTEGER,
    FOREIGN KEY ("fk_idProfissional") REFERENCES public."Psicologo"("idProfissional") -- Referência explícita
);

-- Tabela Atividade_Paciente
CREATE TABLE IF NOT EXISTS public."Atividade_Paciente" (
    "idAtividade" SERIAL PRIMARY KEY NOT NULL,
    "Descricao" VARCHAR(255),
    "NivelDificuldade" DECIMAL(2,1),
    "ObservacaoAtividade" VARCHAR(255),
    "DH_Fim" DATE,
    "fk_idPaciente" INTEGER,
    FOREIGN KEY ("fk_idPaciente") REFERENCES public."Paciente"("idPaciente") -- Referência explícita
);

-- Tabela Anotacao_Paciente
CREATE TABLE IF NOT EXISTS public."Anotacao_Paciente" (
    "idAnotacao" SERIAL PRIMARY KEY NOT NULL,
    "Descricao" VARCHAR(255) NOT NULL,
    "EmocaoEstimada" VARCHAR(255) NOT NULL,
    "Titulo" VARCHAR(255) NOT NULL,
    "DH_Registro" DATE,
    "isVisualizada" BOOLEAN DEFAULT FALSE,
    "fk_idPaciente" INTEGER,
    FOREIGN KEY ("fk_idPaciente") REFERENCES public."Paciente"("idPaciente") -- Referência explícita
);