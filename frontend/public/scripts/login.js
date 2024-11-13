//pagina u_login.html

document.addEventListener('DOMContentLoaded', function () {
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const submitButton = document.querySelector('button[type="submit"]');

    // Mensagens de erro
    const emailErrorMessage = document.createElement('div');
    emailErrorMessage.className = 'text-danger';
    emailErrorMessage.style.display = 'none';
    inputEmail.parentNode.insertBefore(emailErrorMessage, inputEmail.nextSibling);

    const passwordErrorMessage = document.createElement('div');
    passwordErrorMessage.className = 'text-danger';
    passwordErrorMessage.style.display = 'none';
    inputPassword.parentNode.insertBefore(passwordErrorMessage, inputPassword.nextSibling);

    // Validação do e-mail (deve conter @ e pelo menos uma letra/número antes e depois)
    inputEmail.addEventListener('input', function () {
        const emailValue = inputEmail.value;
        // Expressão regular para validar o e-mail
        const emailPattern = /^(?=.*[A-Za-z0-9]).+@(?=.*[A-Za-z0-9]).+$/;

        if (!emailPattern.test(emailValue)) {
            emailErrorMessage.textContent = 'Por favor, insira um e-mail válido (deve conter pelo menos uma letra ou número antes e depois do @)';
            emailErrorMessage.style.display = 'block';
        } else {
            emailErrorMessage.style.display = 'none';
        }
    });


    // Validação da senha (verifica se está preenchida)
    inputPassword.addEventListener('input', function () {
        const passwordValue = inputPassword.value;
        if (passwordValue.trim() === '') {
            passwordErrorMessage.textContent = 'Por favor, insira sua senha';
            passwordErrorMessage.style.display = 'block';
        } else {
            passwordErrorMessage.style.display = 'none';
        }
    });

    // Validação antes de enviar o formulário
    submitButton.addEventListener('click', function (event) {
        const emailValue = inputEmail.value;
        const passwordValue = inputPassword.value;

        let hasErrors = false; // Variável para rastrear se há erros

        // Verifica se o email está preenchido e se a mensagem de erro está visível
        if (!emailValue || emailErrorMessage.style.display === 'block') {
            emailErrorMessage.textContent = 'Preencha seu e-mail para continuar';
            emailErrorMessage.style.display = 'block';
            hasErrors = true; // Define que houve erro
        }

        // Verifica se a senha está preenchida e se a mensagem de erro está visível
        if (!passwordValue) {
            passwordErrorMessage.textContent = 'Preencha sua senha para continuar';
            passwordErrorMessage.style.display = 'block';
            hasErrors = true; // Define que houve erro
        }

        if (hasErrors) {
            event.preventDefault(); // impede o envio do formulário se houver erros
        }
    });
});
