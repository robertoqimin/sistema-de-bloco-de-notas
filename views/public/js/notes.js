        fetch('/notes/list')
            .then(res => res.json())
            .then(data => {
                const container = document.getElementById('notes-container');
                if (data.notes.length === 0) {
                    container.innerHTML = '<p>Nenhuma nota criada.</p>';
                } else {
                    container.innerHTML = data.notes.map(note => `
                        <div>
                            <a href="/notes/${note.id}">
                                <h2>${note.title}</h2>
                                <p><strong>Descrição:</strong> ${note.info}</p>
                            </a>
                        </div>
                    `).join('');
                }
            })
            .catch(() => {
                document.getElementById('notes-container').innerHTML = '<p>Erro ao carregar notas.</p>';
            });
