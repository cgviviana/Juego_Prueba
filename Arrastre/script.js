document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.word');
    const contexts = document.querySelectorAll('.context');

    words.forEach(word => {
        word.addEventListener('dragstart', dragStart);
    });

    contexts.forEach(context => {
        context.addEventListener('dragover', dragOver);
        context.addEventListener('drop', drop);
    });

    function dragStart(event) {
        event.dataTransfer.setData('text', event.target.id);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const wordId = event.dataTransfer.getData('text');
        const word = document.getElementById(wordId);
        const contextType = event.target.getAttribute('data-context');
        const wordType = word.getAttribute('data-word');

        if (contextType === wordType) {
            event.target.appendChild(word);
        } else {
            alert('Palabra incorrecta para este contexto');
        }
    }
});
