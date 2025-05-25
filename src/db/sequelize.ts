import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERRO CRÍTICO: Variável de ambiente DATABASE_URL não definida.');
  console.error('Por favor, defina DATABASE_URL no seu arquivo .env ou nas variáveis de ambiente do Render.');
  process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const CONFIG = {
  CRIAR_BANCO: true,       
  EXECUTAR_CARGA: false    
};

/**
 * Executa um arquivo SQL contendo múltiplos comandos.
 * NÃO USA TRANSAÇÕES EXPLÍCITAS aqui, pois DDLs (CREATE TABLE)
 * se beneficiam de autocommit para serem visíveis imediatamente.
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
        // Executa a query sem uma transação explícita.
        // O PostgreSQL autocommit DDLs, garantindo que as tabelas sejam visíveis.
        await sequelize.query(comando); 
      }
    }
    console.log(`✅ Script ${path.basename(caminhoArquivo)} executado com sucesso`);
  } catch (erro: unknown) {
    console.error(`❌ Falha ao executar ${path.basename(caminhoArquivo)}:`, erro);
    throw erro; 
  }
}

async function inicializarBanco() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso');

    const pastaScripts = path.join(__dirname, './scripts');

    if (CONFIG.CRIAR_BANCO) {
      // Este script cria as tabelas. Deve ser executado e commitado antes dos INSERTs.
      await executarArquivoSQL(path.join(pastaScripts, 'CriarDbPostgres.sql'));
      // Opcional: Pequeno atraso para garantir que o BD internalize a criação
      // await new Promise(resolve => setTimeout(resolve, 100)); 
    }

    if (CONFIG.EXECUTAR_CARGA) {
      // Este script insere os dados.
      await executarArquivoSQL(path.join(pastaScripts, 'CargaInicial.sql'));
    }

    console.log('🟢 Banco de dados inicializado com sucesso');

  } catch (erro: unknown) {
    console.error('❌ Falha crítica na inicialização do banco:', erro);
    
    if (erro instanceof Error) {
      if ('parent' in erro && erro.parent instanceof Error) {
        console.error('Detalhes do erro original (parent):', erro.parent.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error('SQL que causou o erro:', (erro as any).sql); 
      }
      console.error('Mensagem do erro:', erro.message);
    } else {
      console.error('Erro desconhecido:', erro);
    }
    
    process.exit(1);
  }
}

inicializarBanco();

export default sequelize;