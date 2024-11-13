//pagina u_esqueciSenha.html

document.addEventListener('DOMContentLoaded', function () {
    const inputEmail = document.getElementById('inputEmail');
    const submitButton = document.querySelector('button[type="submit"]');

    // Mensagem de erro
    const emailErrorMessage = document.createElement('div');
    emailErrorMessage.className = 'text-danger';
    emailErrorMessage.style.display = 'none'; 
    inputEmail.parentNode.insertBefore(emailErrorMessage, inputEmail.nextSibling);

    // Validação do e-mail (deve conter @)
    inputEmail.addEventListener('input', function () {
        const emailValue = inputEmail.value;
        if (!emailValue.includes('@')) {
            emailErrorMessage.textContent = 'Por favor, insira um e-mail válido';
            emailErrorMessage.style.display = 'block';
        } else {
            emailErrorMessage.style.display = 'none';
        }
    });

    // Validação antes de enviar o formulário
    submitButton.addEventListener('click', function (event) {
        const emailValue = inputEmail.value;

        // Verifica se o campo de e-mail está vazio ou se o e-mail é inválido
        if (!emailValue) {
            emailErrorMessage.textContent = 'Por favor, preencha o campo de e-mail';
            emailErrorMessage.style.display = 'block';
            event.preventDefault(); // Impede o envio do formulário se o campo estiver vazio
        } else if (emailErrorMessage.style.display === 'block') {
            event.preventDefault(); // Impede o envio do formulário se houver mensagem de erro
        }
    });

});
