const isProduction = process.env.NODE_ENV === 'production';

function requireEnv(name) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
    }

    return value;
}

const JWT_SECRET = requireEnv('JWT_SECRET');

module.exports = {
    isProduction,
    JWT_SECRET
};
