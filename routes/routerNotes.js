const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');
const authenticate = require('../middleware/auth');

function validateNoteInput({ title, info, content }) {
    if (!title || !info || !content) {
        return 'Preencha titulo, descricao e conteudo.';
    }

    if (title.trim().length < 3) {
        return 'O titulo deve ter pelo menos 3 caracteres.';
    }

    if (info.trim().length < 3) {
        return 'A descricao deve ter pelo menos 3 caracteres.';
    }

    return null;
}

router.get('/notes', authenticate, (req, res) => {
    res.render(path.join(__dirname, '../', 'views', 'notes'), { user: req.user });
});


router.get('/notes/create', authenticate, (req, res) => {
    res.render(path.join(__dirname, '../', 'views', 'notesCreate'), { user: req.user });
});


router.post('/notes/create', authenticate, (req, res) => {
    const { title, info, content } = req.body;
    const validationError = validateNoteInput({ title, info, content });

    if (validationError) {
        return res.status(400).send(validationError);
    }

    db.query(
        'INSERT INTO notes (title, info, content, username_id) VALUES (?, ?, ?, ?)',
        [title.trim(), info.trim(), content.trim(), req.user.id],
        (err) => {
            if (err) {
                return res.status(500).send('Erro ao criar nota');
            }
            res.redirect('/notes');
        }
    );
});



router.get('/notes/list', authenticate, (req, res) => {
    db.query('SELECT * FROM notes WHERE username_id = ?', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar notas' });
        res.json({ notes: results });
    });
});


router.get('/notes/:id', authenticate, (req, res) => {
    const noteId = req.params.id;
    db.query(
        'SELECT * FROM notes WHERE id = ? AND username_id = ?',
        [noteId, req.user.id],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao buscar nota');
            }
            if (results.length === 0) {
                return res.status(404).send('Nota não encontrada');
            }
            res.render(path.join(__dirname, '../', 'views', 'note'), { note: results[0], user: req.user });
        }
    );
});


router.get('/notes/:id/edit', authenticate, (req, res) => {
    const noteId = req.params.id;
    db.query(
        'SELECT * FROM notes WHERE id = ? AND username_id = ?',
        [noteId, req.user.id],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao buscar nota');
            }
            if (results.length === 0) {
                return res.status(404).send('Nota não encontrada');
            }
            res.render(path.join(__dirname, '../', 'views', 'notesEdit'), { note: results[0], user: req.user });
        }
    );
});


router.post('/notes/:id/edit', authenticate, (req, res) => {
    const noteId = req.params.id;
    const { title, info, content } = req.body;
    const validationError = validateNoteInput({ title, info, content });

    if (validationError) {
        return res.status(400).send(validationError);
    }

    db.query(
        'UPDATE notes SET title = ?, info = ?, content = ? WHERE id = ? AND username_id = ?',
        [title.trim(), info.trim(), content.trim(), noteId, req.user.id],
        (err, result) => {
            if (err) {
                return res.status(500).send('Erro ao atualizar nota');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Nota não encontrada');
            }

            res.redirect(`/notes/${noteId}`);
        }
    );
});

router.post('/notes/:id/delete', authenticate, (req, res) => {
    const noteId = req.params.id;

    db.query(
        'DELETE FROM notes WHERE id = ? AND username_id = ?',
        [noteId, req.user.id],
        (err, result) => {
            if (err) {
                return res.status(500).send('Erro ao deletar nota');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Nota não encontrada');
            }

            res.redirect('/notes');
        }
    );
});

module.exports = router;
