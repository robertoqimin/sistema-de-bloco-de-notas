const content = document.getElementById('content');
const counter = document.getElementById('word-count');
function updateDocument() {
    const words = content.value.trim().split(/\s+/u).filter(Boolean).length;
    counter.textContent = `${words} ${words === 1 ? 'palavra' : 'palavras'}`;
    content.style.height = 'auto';
    content.style.height = `${content.scrollHeight}px`;
}
document.querySelector('.document-form').addEventListener('input', (event) => {
    if (event.target.matches('input, textarea')) {
        document.getElementById('save-status').textContent = 'Alterações não salvas';
        updateDocument();
    }
});
document.getElementById('zoom').addEventListener('change', (event) => {
    content.style.fontSize = `${16 * Number(event.target.value)}px`;
    updateDocument();
});
window.addEventListener('resize', updateDocument);
updateDocument();
