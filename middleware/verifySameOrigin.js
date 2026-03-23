const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function verifySameOrigin(req, res, next) {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    const origin = req.get('origin');
    const host = req.get('host');

    if (!origin) {
        return next();
    }

    let originHost;

    try {
        originHost = new URL(origin).host;
    } catch (error) {
        return res.status(403).send('Origem da requisicao invalida.');
    }

    if (originHost !== host) {
        return res.status(403).send('Requisicao bloqueada por seguranca.');
    }

    next();
}

module.exports = verifySameOrigin;
