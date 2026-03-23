fetch('/notes/list')
    .then((res) => res.json())
    .then((data) => {
        const container = document.getElementById('notes-container');

        if (data.notes.length === 0) {
            container.innerHTML = '<p class="notes-empty">Nenhuma nota criada ainda. Comece registrando sua primeira ideia.</p>';
            return;
        }

        container.innerHTML = data.notes.map((note) => `
            <a class="note-card" href="/notes/${note.id}">
                <span class="note-card-label">Nota</span>
                <h2>${note.title}</h2>
                <p>${note.info}</p>
            </a>
        `).join('');
    })
    .catch(() => {
        document.getElementById('notes-container').innerHTML = '<p class="notes-error">Erro ao carregar notas. Tente novamente em instantes.</p>';
    });
