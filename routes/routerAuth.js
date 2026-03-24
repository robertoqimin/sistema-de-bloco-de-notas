const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, isProduction } = require('../config');

const path = require('path')

const db = require('../db')

function isFetchRequest(req) {
    return req.get('x-requested-with') === 'fetch' || req.accepts(['json', 'html']) === 'json';
}

function sendAuthError(req, res, status, message) {
    if (isFetchRequest(req)) {
        return res.status(status).json({ ok: false, message });
    }

    return res.status(status).send(message);
}

function sendAuthSuccess(req, res, redirectTo) {
    if (isFetchRequest(req)) {
        return res.json({ ok: true, redirectTo });
    }

    return res.redirect(redirectTo);
}

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
        return sendAuthError(req, res, 400, validationError);
    }

    const hash = await bcrypt.hash(password, 8);
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username.trim(), email.trim().toLowerCase(), hash],
    (err) => {
    if (err?.code === 'ER_DUP_ENTRY') return sendAuthError(req, res, 409, 'Este email ja esta em uso.');
    if (err) return sendAuthError(req, res, 500, 'Erro ao registrar');
    return sendAuthSuccess(req, res, '/login');
  });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const validationError = validateLoginInput({ email, password });

    if (validationError) {
        return sendAuthError(req, res, 400, validationError);
    }

    db.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()], async (err, results) => {
        if (err || results.length === 0) return sendAuthError(req, res, 401, 'Credenciais inválidas');
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return sendAuthError(req, res, 401, 'Credenciais inválidas');
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProduction
        });
        return sendAuthSuccess(req, res, '/');
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
