import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  logging: console.log
});

const CONFIG = {
  CRIAR_BANCO: true,       
  EXECUTAR_CARGA: false    
};

/**
 * Executa um arquivo SQL contendo múltiplos comandos
 * @param caminhoArquivo Caminho completo do arquivo SQL
 */
async function executarArquivoSQL(caminhoArquivo: string) {
  try {
    const conteudoSQL = fs.readFileSync(caminhoArquivo, 'utf8');

    const comandos = conteudoSQL
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

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

/**
 * Inicializa o banco de dados conforme configuração
 */
async function inicializarBanco() {
  try {
    // Testa a conexão com o banco
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso');

    const pastaScripts = path.join(__dirname, './scripts');

    if (CONFIG.CRIAR_BANCO) {
      await executarArquivoSQL(path.join(pastaScripts, 'CriarDbMYSQL.sql'));
    }

    if (CONFIG.EXECUTAR_CARGA) {
      await executarArquivoSQL(path.join(pastaScripts, 'Cargainicial.sql'));
    }

    console.log('🟢 Banco de dados inicializado com sucesso');

  } catch (erro) {
    console.error('❌ Falha crítica na inicialização do banco:', erro);
    process.exit(1);
  }
}


inicializarBanco();

export default sequelize;