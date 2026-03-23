const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send('Acesso nao autorizado. Faca login primeiro.');
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).send('Token invalido ou expirado.');
    }
}

module.exports = authenticate;
