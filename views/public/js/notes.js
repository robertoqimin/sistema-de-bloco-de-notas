const container = document.getElementById('notes-container');

function renderMessage(className, text) {
    const message = document.createElement('p');
    message.className = className;
    message.textContent = text;
    container.replaceChildren(message);
}

function createNoteCard(note) {
    const link = document.createElement('a');
    link.className = 'note-card';
    link.href = `/notes/${note.id}`;

    const label = document.createElement('span');
    label.className = 'note-card-label';
    label.textContent = 'Nota';

    const title = document.createElement('h2');
    title.textContent = note.title;

    const info = document.createElement('p');
    info.textContent = note.info;

    link.append(label, title, info);

    return link;
}

fetch('/notes/list')
    .then((res) => {
        if (!res.ok) {
            throw new Error('Falha ao carregar notas');
        }

        return res.json();
    })
    .then((data) => {
        if (!Array.isArray(data.notes) || data.notes.length === 0) {
            renderMessage('notes-empty', 'Nenhuma nota criada ainda. Comece registrando sua primeira ideia.');
            return;
        }

        container.replaceChildren(...data.notes.map(createNoteCard));
    })
    .catch(() => {
        renderMessage('notes-error', 'Erro ao carregar notas. Tente novamente em instantes.');
    });
