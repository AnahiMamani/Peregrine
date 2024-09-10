document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('a');
    if (button) {
        button.addEventListener('click', function() {
            alert('Você clicou');
        });
    }
});
