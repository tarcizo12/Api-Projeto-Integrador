CREATE DATABASE IF NOT EXISTS projeto_integrador;

CREATE TABLE IF NOT EXISTS projeto_integrador.Psicologo (
    idProfissional INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    CRP VARCHAR(15),
    Email VARCHAR(255) NOT NULL UNIQUE ,
    Senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS projeto_integrador.Paciente (
    idPaciente INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    Data_Nascimento DATE NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE ,
    NomeDoResponsavel VARCHAR(255),
    Telefone BIGINT,
    Senha VARCHAR(255) NOT NULL,
    fk_idProfissional INT,
    FOREIGN KEY (fk_idProfissional) REFERENCES Psicologo(idProfissional)
);

CREATE TABLE IF NOT EXISTS projeto_integrador.Atividade_Paciente (
    idAtividade INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    Descricao VARCHAR(255),
    NivelDificuldade DECIMAL(2,1),
    ObservacaoAtividade VARCHAR(255),
    DH_Fim DATE,
    fk_idPaciente INT,
    FOREIGN KEY (fk_idPaciente) REFERENCES Paciente(idPaciente)
);

CREATE TABLE IF NOT EXISTS projeto_integrador.Anotacao_Paciente (
    idAnotacao INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    Descricao VARCHAR(255) NOT NULL,
    EmocaoEstimada VARCHAR(255) NOT NULL,
    Titulo VARCHAR(255) NOT NULL,
    DH_Registro DATE,
    isVisualizada BOOLEAN DEFAULT FALSE,
    fk_idPaciente INT,
    FOREIGN KEY (fk_idPaciente) REFERENCES Paciente(idPaciente)
);
