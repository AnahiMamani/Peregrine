//pagina u_esqueciSenha.html

document.addEventListener('DOMContentLoaded', function () {
    const inputEmail = document.getElementById('inputEmail');
    const submitButton = document.querySelector('button[type="submit"]');

    // mensagem de erro
    const emailErrorMessage = document.createElement('div');
    emailErrorMessage.className = 'text-danger';
    emailErrorMessage.style.display = 'none'; 
    inputEmail.parentNode.insertBefore(emailErrorMessage, inputEmail.nextSibling);

    // validação do e-mail (deve conter @)
    inputEmail.addEventListener('input', function () {
        const emailValue = inputEmail.value;
        if (!emailValue.includes('@')) {
            emailErrorMessage.textContent = 'Por favor, insira um e-mail válido';
            emailErrorMessage.style.display = 'block';
        } else {
            emailErrorMessage.style.display = 'none';
        }
    });

    // validação antes de enviar o formulário
    submitButton.addEventListener('click', function (event) {
        const emailValue = inputEmail.value;

        // verifica se o campo de e-mail está vazio ou se o e-mail é inválido
        if (!emailValue || emailErrorMessage.style.display === 'block') {
            event.preventDefault(); // impede o envio do formulário
            alert('Você precisa preencher o e-mail para continuar :/');
        }
    });
});
