const mysql = require('mysql2');

const config = {
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dbnotas',
  connectTimeout: 10000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(config);

function connectWithRetry() {
  db.getConnection((err, connection) => {
    if (err) {
      console.error(
        `erro ao conectar no banco (${config.host}:${config.port}/${config.database}), tentando novamente em 5s:`,
        err.message
      );
      setTimeout(connectWithRetry, 5000);
      return;
    }

    console.log(`conexao estabelecida com o banco de dados em ${config.host}:${config.port}`);
    connection.release();
  });
}

connectWithRetry();

module.exports = db;
