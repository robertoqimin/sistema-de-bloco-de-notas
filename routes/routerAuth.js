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
        res.redirect('/');
    });
});


router.post('/logout', (req, res) => {
    // Limpa o cookie do token
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;