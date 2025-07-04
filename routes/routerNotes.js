const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');
const jwt = require('jsonwebtoken');
const methodOverride = require('method-override');

const SECRET = 'chave-secreta';

router.get('/notes', (req, res) => {
    // Verifica se o usuário está autenticado
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Acesso não autorizado. Faça login primeiro.');
    }

    // Verifica o token JWT
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado.');
        }

        // Se o token for válido, renderiza a página home
        res.render(path.join(__dirname, '../', 'views', 'notes'), { user: decoded });
    });
});


router.get('/notes/create', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Acesso não autorizado. Faça login primeiro.');
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado.');
        }

        res.render(path.join(__dirname, '../', 'views', 'notesCreate'), { user: decoded });
    });
});


router.post('/notes/create', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Acesso não autorizado. Faça login primeiro.');
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado.');
        }

        const { title, info, content } = req.body;    
        db.query(
            'INSERT INTO notes (title, info, content, username_id) VALUES (?, ?, ?, ?)',
            [title, info, content, decoded.id],
            (err) => {
                if (err) {
                    return res.status(500).send('Erro ao criar nota');
                }
                res.redirect('/notes');
            }
        );
    });
});



router.get('/notes/list', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Token ausente' });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

        db.query('SELECT * FROM notes WHERE username_id = ?', [decoded.id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar notas' });
            res.json({ notes: results });
        });
    });
});


router.get('/notes/:id', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Acesso não autorizado. Faça login primeiro.');
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado.');
        }

        const noteId = req.params.id;
        db.query(
            'SELECT * FROM notes WHERE id = ? AND username_id = ?',
            [noteId, decoded.id],
            (err, results) => {
                if (err) {
                    return res.status(500).send('Erro ao buscar nota');
                }
                if (results.length === 0) {
                    return res.status(404).send('Nota não encontrada');
                }
                res.render(path.join(__dirname, '../', 'views', 'note'), { note: results[0], user: decoded });
            }
        );
    });
});


router.get('/notes/:id/edit', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Acesso não autorizado. Faça login primeiro.');
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado.');
        }

        const noteId = req.params.id;
        db.query(
            'SELECT * FROM notes WHERE id = ? AND username_id = ?',
            [noteId, decoded.id],
            (err, results) => {
                if (err) {
                    return res.status(500).send('Erro ao buscar nota');
                }
                if (results.length === 0) {
                    return res.status(404).send('Nota não encontrada');
                }
                res.render(path.join(__dirname, '../', 'views', 'notesEdit'), { note: results[0], user: decoded });
            }
        );
    });
});


router.post('/notes/:id/edit', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Acesso não autorizado. Faça login primeiro.');
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado.');
        }

        const noteId = req.params.id;
        const { title, info, content } = req.body;

        db.query(
            'UPDATE notes SET title = ?, info = ?, content = ? WHERE id = ? AND username_id = ?',
            [title, info, content, noteId, decoded.id],
            (err) => {
                if (err) {
                    return res.status(500).send('Erro ao atualizar nota');
                }
                res.redirect(`/notes/${noteId}`);
            }
        );
    });
});

router.post('/notes/:id/delete', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Acesso não autorizado. Faça login primeiro.');
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado.');
        }

        const noteId = req.params.id;

        db.query(
            'DELETE FROM notes WHERE id = ? AND username_id = ?',
            [noteId, decoded.id],
            (err) => {
                if (err) {
                    return res.status(500).send('Erro ao deletar nota');
                }
                res.redirect('/notes');
            }
        );
    });
});

module.exports = router;