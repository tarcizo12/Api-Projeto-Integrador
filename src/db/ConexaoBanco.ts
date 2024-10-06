import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class ConexaoBanco {
  private static instance: mysql.Pool;

  private constructor() {}

  public static getInstance(): mysql.Pool {
    if (!ConexaoBanco.instance) {
      ConexaoBanco.instance = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return ConexaoBanco.instance;
  }
}
