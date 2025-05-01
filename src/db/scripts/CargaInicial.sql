USE projeto_integrador;

-- Inserir Psicólogo
INSERT INTO Psicologo (Nome, CPF, CRP, Email)
VALUES 
('Dr. João Silva', '12345678901', 'CRP-12345', 'joao.silva@exemplo.com');

-- Inserir Pacientes
INSERT INTO Paciente (Nome, Data_Nascimento, CPF, Email, NomeDoResponsavel, Telefone, fk_idProfissional)
VALUES 
('Carlos Souza', '1990-05-15', '98765432100', 'carlos.souza@exemplo.com', 'Maria Souza', 11987654321, 1),
('Ana Lima', '1985-09-30', '12345098765', 'ana.lima@exemplo.com', 'Roberto Lima', 11998765432, 1);

-- Inserir Atividades para os Pacientes
INSERT INTO Atividade_Paciente (Descricao, NivelDificuldade, ObservacaoAtividade, DH_Fim, fk_idPaciente)
VALUES 
('Atividade 1 para Carlos', 2.5, 'Conclusão parcial', '2024-10-01', 1),
('Atividade 2 para Carlos', 3.0, 'Desenvolvimento em progresso', '2024-10-02', 1),
('Atividade 3 para Carlos', 4.0, 'Atividade concluída com sucesso', '2024-10-03', 1),
('Atividade 1 para Ana', 3.5, 'Conclusão parcial', '2024-10-01', 2),
('Atividade 2 para Ana', 2.0, 'Desenvolvimento em progresso', '2024-10-02', 2),
('Atividade 3 para Ana', 4.5, 'Atividade concluída com sucesso', '2024-10-03', 2);

-- Inserir Anotações para os Pacientes
INSERT INTO Anotacao_Paciente (Descricao, EmocaoEstimada, DH_Registro, fk_idPaciente, Titulo)
VALUES 
('Anotação 1 para Carlos', 'Felicidade', '2023-09-28', 1, "Esse é  um dado de teste"),
('Anotação 2 para Carlos', 'Ansiedade', '2024-09-29', 1 , "Esse é  um dado de teste"),
('Anotação 3 para Carlos', 'Satisfacao', '2022-09-30', 1, "Esse é  um dado de teste"),
('Anotação 1 para Ana', 'Esperanca', '2020-09-28', 2, "Esse é  um dado de teste"),
('Anotação 2 para Ana', 'Tristeza', '2021-09-29', 2, "Esse é  um dado de teste"),
('Anotação 3 para Ana', 'Alegria', '2019-09-30', 2, "Esse é  um dado de teste");
