import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { hashPassword, isPasswordHashed } from '../utils/password';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  timezone: '-03:00',
  dialectOptions: {
    dateStrings: false,
    typeCast: true,
  },
  logging: isDevelopment ? console.log : false,
});

const CONFIG = {
  CRIAR_BANCO: process.env.DB_AUTO_MIGRATE === 'true' || isDevelopment,
  EXECUTAR_CARGA: process.env.DB_SEED === 'true' || isDevelopment,
};

async function executarArquivoSQL(caminhoArquivo: string) {
  try {
    const conteudoSQL = fs.readFileSync(caminhoArquivo, 'utf8');

    const comandos = conteudoSQL
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(';')
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0);

    for (const comando of comandos) {
      if (comando) {
        await sequelize.query(comando);
      }
    }
    console.log(`✅ Script ${path.basename(caminhoArquivo)} executado com sucesso`);
  } catch (erro) {
    console.error(`❌ Falha ao executar ${path.basename(caminhoArquivo)}:`, erro);
    throw erro;
  }
}

async function garantirSenhasHasheadas() {
  const tables = [
    { table: 'Paciente', idColumn: 'idPaciente' },
    { table: 'Psicologo', idColumn: 'idProfissional' },
  ] as const;

  for (const { table, idColumn } of tables) {
    const [rows] = await sequelize.query(
      `SELECT ${idColumn} AS id, Senha AS senha FROM ${table}`
    );

    for (const row of rows as Array<{ id: number; senha: string }>) {
      if (!isPasswordHashed(row.senha)) {
        const hashed = await hashPassword(row.senha);
        await sequelize.query(`UPDATE ${table} SET Senha = :senha WHERE ${idColumn} = :id`, {
          replacements: { senha: hashed, id: row.id },
        });
      }
    }
  }

  console.log('✅ Senhas do seed normalizadas com bcrypt');
}

async function inicializarBanco() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso');

    const pastaScripts = path.join(__dirname, './scripts');

    if (CONFIG.CRIAR_BANCO) {
      await executarArquivoSQL(path.join(pastaScripts, 'CriarDbMYSQL.sql'));
    }

    if (CONFIG.EXECUTAR_CARGA) {
      await executarArquivoSQL(path.join(pastaScripts, 'CargaInicial.sql'));
      await garantirSenhasHasheadas();
    }

    console.log('🟢 Banco de dados inicializado com sucesso');
  } catch (erro) {
    console.error('❌ Falha crítica na inicialização do banco:', erro);
    process.exit(1);
  }
}

inicializarBanco();

export default sequelize;
