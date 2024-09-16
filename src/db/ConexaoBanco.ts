import mysql from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

const ConexaoMYSQL: Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  

export default ConexaoMYSQL;


//Testar Conexão
// ConexaoMYSQL.connect((err) => {
//     if (err) {
//         console.error('Erro ao conectar ao banco de dados:', err);
//         return;
//     };
//     console.log('Conectado ao banco de dados MySQL');
// });

// No futuro, aqui seria o local para interagir com o banco de dados
// const sql = 'INSERT INTO users (name, age) VALUES (?, ?)';
// connection.query(sql, [], (err, results) => {
//     if (err) throw err;
// });


