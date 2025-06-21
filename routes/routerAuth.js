const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = 'chave-secreta';

const path = require('path')

const db = require('../db')


router.get('/register', (req, res) => {
    res.render(path.join(__dirname, '../', 'views', 'userRegister'))
})

router.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../', 'views', 'userLogin'))
})

router.post('/register', async (req, res) =>{
    const{username, email, password} = req.body;
    const hash = await bcrypt.hash(password, 8);
  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username,email, hash], (err) => {
    if (err) return res.status(500).send('Erro ao registrar');
    res.redirect('/login');
  });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Usuário não encontrado');
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('Senha inválida');
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
        // Envia o token como cookie
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/notes');
    });
});

// Middleware para verificar token
function verifyToken(req, res, next) {
    // Tenta obter o token do header, query ou cookie
    const auth = req.headers.authorization || req.query.token || (req.cookies && req.cookies.token);
    let token;
    if (auth && auth.startsWith && auth.startsWith('Bearer ')) {
        token = auth.split(' ')[1];
    } else if (typeof auth === 'string') {
        token = auth;
    }
    // Se não encontrou, tenta pegar do cookie
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) return res.status(403).send('Não logado');
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(403).send('Token inválido');
    }
}


router.get('/logout', (req, res) => {
    // Limpa o cookie do token
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;