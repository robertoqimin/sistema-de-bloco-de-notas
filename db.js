const mysql = require('mysql2')


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbnotas'
})


db.connect(err => {
    if (err) throw err;
    console.log('conexão estabelecida com o banco de daddos')
})

module.exports = db;