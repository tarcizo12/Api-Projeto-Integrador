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

async function executeSqlFile(filePath: string) {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');

    const commands = sqlContent
      .replace(/--.*$/gm, '')  
      .replace(/\/\*[\s\S]*?\*\//g, '')  
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    for (const command of commands) {
      if (command) {
        await sequelize.query(command);
      }
    }
    console.log(`✅ Script ${path.basename(filePath)} executado com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao executar ${path.basename(filePath)}:`, error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida');

    const scriptsDir = path.join(__dirname, './scripts');
    await executeSqlFile(path.join(scriptsDir, 'CriarDbMYSQL.sql'));
    await executeSqlFile(path.join(scriptsDir, 'Cargainicial.sql'));

  } catch (error) {
    console.error('❌ Falha na inicialização do banco:', error);
    process.exit(1);
  }
}

initializeDatabase();

export default sequelize;