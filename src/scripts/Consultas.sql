USE projeto_integrador;

-- Tabela profissional
SELECT * FROM psicologo;

-- Tabela paciente
SELECT * FROM paciente;

-- Tabela anotacao
SELECT * FROM anotacao_paciente WHERE fk_idPaciente =1 ORDER by idAnotacao DESC;

DELETE FROM anotacao_paciente WHERE fk_idPaciente =1;
-- Tabela atividade paciente
SELECT * FROM atividade_paciente;

SELECT `idPaciente`, `nome`, `Data_Nascimento`, `cpf`, `email`, `nomeDoResponsavel`, `telefone`, `fk_idProfissional` FROM `Paciente` AS `PacienteModel` WHERE `PacienteModel`.`fk_idProfissional` = '1';