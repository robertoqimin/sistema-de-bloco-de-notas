const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || '172.18.0.2',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'dbnotas'
});

function connectWithRetry() {
    db.connect((err) => {
        if (err) {
            console.error('erro ao conectar no banco, tentando novamente em 5s:', err.message);
            setTimeout(connectWithRetry, 5000);
            return;
        }

        console.log('conexao estabelecida com o banco de dados');
    });
}

connectWithRetry();

module.exports = db;
