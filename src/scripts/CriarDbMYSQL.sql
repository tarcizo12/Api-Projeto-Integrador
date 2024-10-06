-- Criação do schema apenas se não existir
CREATE DATABASE IF NOT EXISTS projeto_integrador;
USE projeto_integrador;

-- Tabela Profissional
CREATE TABLE IF NOT EXISTS Psicologo (
    idProfissional INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    CRP VARCHAR(15),
    Email VARCHAR(255)
);

-- Tabela Paciente
CREATE TABLE IF NOT EXISTS Paciente (
    idPaciente INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    Data_Nascimento DATE NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    Email VARCHAR(255),
    NomeDoResponsavel VARCHAR(255),
    Telefone BIGINT,
    fk_idProfissional INT,
    FOREIGN KEY (fk_idProfissional) REFERENCES Psicologo(idProfissional)
);

-- Tabela Atividades Paciente
CREATE TABLE IF NOT EXISTS Atividade_Paciente (
    idAtividade INT PRIMARY KEY AUTO_INCREMENT,
    Descricao VARCHAR(255),
    NivelDificuldade DECIMAL(2,1),
    ObservacaoAtividade VARCHAR(255),
    DH_Fim DATE,
    fk_idPaciente INT,
    FOREIGN KEY (fk_idPaciente) REFERENCES Paciente(idPaciente)
);

-- Tabela Anotações Paciente
CREATE TABLE IF NOT EXISTS Anotacao_Paciente (
    idAnotacao INT PRIMARY KEY AUTO_INCREMENT,
    Descricao VARCHAR(255),
    DH_Registro DATE,
    fk_idPaciente INT,
    FOREIGN KEY (fk_idPaciente) REFERENCES Paciente(idPaciente)
);
