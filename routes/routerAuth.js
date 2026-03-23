const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, isProduction } = require('../config');

const path = require('path')

const db = require('../db')

function validateRegisterInput({ username, email, password }) {
    if (!username || !email || !password) {
        return 'Preencha todos os campos.';
    }

    if (username.trim().length < 3) {
        return 'O nome deve ter pelo menos 3 caracteres.';
    }

    if (password.length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres.';
    }

    return null;
}

function validateLoginInput({ email, password }) {
    if (!email || !password) {
        return 'Informe email e senha.';
    }

    return null;
}


router.get('/register', (req, res) => {
    res.render(path.join(__dirname, '../', 'views', 'userRegister'))
})

router.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../', 'views', 'userLogin'))
})

router.post('/register', async (req, res) =>{
    const { username, email, password } = req.body;
    const validationError = validateRegisterInput({ username, email, password });

    if (validationError) {
        return res.status(400).send(validationError);
    }

    const hash = await bcrypt.hash(password, 8);
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username.trim(), email.trim().toLowerCase(), hash],
    (err) => {
    if (err?.code === 'ER_DUP_ENTRY') return res.status(409).send('Este email ja esta em uso.');
    if (err) return res.status(500).send('Erro ao registrar');
    res.redirect('/login');
  });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const validationError = validateLoginInput({ email, password });

    if (validationError) {
        return res.status(400).send(validationError);
    }

    db.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Credenciais inválidas');
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('Credenciais inválidas');
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProduction
        });
        res.redirect('/');
    });
});


router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction
    });
    res.redirect('/');
});

module.exports = router;
