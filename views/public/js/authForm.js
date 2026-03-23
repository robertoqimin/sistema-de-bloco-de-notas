const authForms = document.querySelectorAll('[data-auth-form]');

function setMessage(feedbackElement, type, message) {
    feedbackElement.textContent = message;
    feedbackElement.className = `form-feedback is-${type}`;
    feedbackElement.hidden = false;
}

authForms.forEach((form) => {
    const submitButton = form.querySelector('button[type="submit"]');
    const feedbackElement = form.parentElement.querySelector('[data-form-feedback]');
    const successMessage = form.dataset.successMessage || 'Operacao realizada com sucesso.';
    const defaultButtonText = submitButton ? submitButton.textContent : '';

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!feedbackElement || !submitButton) {
            form.submit();
            return;
        }

        feedbackElement.hidden = true;
        feedbackElement.textContent = '';
        feedbackElement.className = 'form-feedback';

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'fetch'
                },
                body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Nao foi possivel concluir a operacao.');
            }

            setMessage(feedbackElement, 'success', data.message || successMessage);

            if (data.redirectTo) {
                window.setTimeout(() => {
                    window.location.href = data.redirectTo;
                }, 600);
            }
        } catch (error) {
            setMessage(feedbackElement, 'error', error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = defaultButtonText;
        }
    });
});
