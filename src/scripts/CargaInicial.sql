USE projeto_integrador;

-- Inserir Psicólogo
INSERT INTO Psicologo (Nome, CPF, CRP, Email)
VALUES ('Dr. João Silva', '12345678901', 'CRP-12345', 'joao.silva@exemplo.com');

-- Inserir Pacientes
INSERT INTO Paciente (Nome, Data_Nascimento, CPF, Email, NomeDoResponsavel, Telefone, fk_idProfissional)
VALUES ('Carlos Souza', '1990-05-15', '98765432100', 'carlos.souza@exemplo.com', 'Maria Souza', 11987654321, 1);

INSERT INTO Paciente (Nome, Data_Nascimento, CPF, Email, NomeDoResponsavel, Telefone, fk_idProfissional)
VALUES ('Ana Lima', '1985-09-30', '12345098765', 'ana.lima@exemplo.com', 'Roberto Lima', 11998765432, 1);

-- Inserir Atividades para Carlos Souza
INSERT INTO Atividade_Paciente (Descricao, NivelDificuldade, ObservacaoAtividade, DH_Fim, fk_idPaciente)
VALUES ('Atividade 1 para Carlos', 2.5, 'Conclusão parcial', '2024-10-01', 1);

INSERT INTO Atividade_Paciente (Descricao, NivelDificuldade, ObservacaoAtividade, DH_Fim, fk_idPaciente)
VALUES ('Atividade 2 para Carlos', 3.0, 'Desenvolvimento em progresso', '2024-10-02', 1);

INSERT INTO Atividade_Paciente (Descricao, NivelDificuldade, ObservacaoAtividade, DH_Fim, fk_idPaciente)
VALUES ('Atividade 3 para Carlos', 4.0, 'Atividade concluída com sucesso', '2024-10-03', 1);

-- Inserir Anotações para Carlos Souza
INSERT INTO Anotacao_Paciente (Descricao, DH_Registro, fk_idPaciente)
VALUES ('Anotação 1 para Carlos', '2024-09-28', 1);

INSERT INTO Anotacao_Paciente (Descricao, DH_Registro, fk_idPaciente)
VALUES ('Anotação 2 para Carlos', '2024-09-29', 1);

INSERT INTO Anotacao_Paciente (Descricao, DH_Registro, fk_idPaciente)
VALUES ('Anotação 3 para Carlos', '2024-09-30', 1);

-- Inserir Atividades para Ana Lima
INSERT INTO Atividade_Paciente (Descricao, NivelDificuldade, ObservacaoAtividade, DH_Fim, fk_idPaciente)
VALUES ('Atividade 1 para Ana', 3.5, 'Conclusão parcial', '2024-10-01', 2);

INSERT INTO Atividade_Paciente (Descricao, NivelDificuldade, ObservacaoAtividade, DH_Fim, fk_idPaciente)
VALUES ('Atividade 2 para Ana', 2.0, 'Desenvolvimento em progresso', '2024-10-02', 2);

INSERT INTO Atividade_Paciente (Descricao, NivelDificuldade, ObservacaoAtividade, DH_Fim, fk_idPaciente)
VALUES ('Atividade 3 para Ana', 4.5, 'Atividade concluída com sucesso', '2024-10-03', 2);

-- Inserir Anotações para Ana Lima
INSERT INTO Anotacao_Paciente (Descricao, DH_Registro, fk_idPaciente)
VALUES ('Anotação 1 para Ana', '2024-09-28', 2);

INSERT INTO Anotacao_Paciente (Descricao, DH_Registro, fk_idPaciente)
VALUES ('Anotação 2 para Ana', '2024-09-29', 2);

INSERT INTO Anotacao_Paciente (Descricao, DH_Registro, fk_idPaciente)
VALUES ('Anotação 3 para Ana', '2024-09-30', 2);
