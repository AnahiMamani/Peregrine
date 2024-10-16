//pagina u_cadastro.html

document.addEventListener('DOMContentLoaded', function () {
    const inputName = document.getElementById('inputName');
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    const inputPhone = document.getElementById('inputPhone');
    const submitButton = document.querySelector('button[type="submit"]');

    // mensagens de erro
    const nameErrorMessage = document.createElement('div');
    nameErrorMessage.className = 'text-danger';
    nameErrorMessage.style.display = 'none'; 
    inputName.parentNode.insertBefore(nameErrorMessage, inputName.nextSibling);

    const emailErrorMessage = document.createElement('div');
    emailErrorMessage.className = 'text-danger';
    emailErrorMessage.style.display = 'none';
    inputEmail.parentNode.insertBefore(emailErrorMessage, inputEmail.nextSibling);

    const passwordErrorMessage = document.createElement('div');
    passwordErrorMessage.className = 'text-danger';
    passwordErrorMessage.style.display = 'none';
    inputConfirmPassword.parentNode.insertBefore(passwordErrorMessage, inputConfirmPassword.nextSibling);

    const phoneErrorMessage = document.createElement('div');
    phoneErrorMessage.className = 'text-danger';
    phoneErrorMessage.style.display = 'none';
    inputPhone.parentNode.insertBefore(phoneErrorMessage, inputPhone.nextSibling);

    // Validação do nome (somente letras)
    inputName.addEventListener('input', function () {
        const nameValue = inputName.value;
        if (/[^a-zA-ZÀ-ÿ\s]/.test(nameValue) || nameValue.trim() === '') {
            nameErrorMessage.textContent = 'Preencha com um nome válido (somente letras)';
            nameErrorMessage.style.display = 'block';
        } else {
            nameErrorMessage.style.display = 'none';
        }
    });

    // validação do email (deve conter @)
    inputEmail.addEventListener('input', function () {
        const emailValue = inputEmail.value;
        if (!emailValue.includes('@')) {
            emailErrorMessage.textContent = 'Por favor, insira um email válido';
            emailErrorMessage.style.display = 'block';
        } else {
            emailErrorMessage.style.display = 'none';
        }
    });

    // validação da senha e confirmação de senha
    inputConfirmPassword.addEventListener('input', function () {
        const passwordValue = inputPassword.value;
        const confirmPasswordValue = inputConfirmPassword.value;
        if (passwordValue !== confirmPasswordValue) {
            passwordErrorMessage.textContent = 'As senhas não conferem';
            passwordErrorMessage.style.display = 'block';
        } else {
            passwordErrorMessage.style.display = 'none';
        }
    });

    // validação do telefone (formato: (00) 00000-0000)
    inputPhone.addEventListener('input', function () {
        const phoneValue = inputPhone.value;
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;

        // verifica se contém caracteres inválidos
        if (/[^0-9\s()-]/.test(phoneValue)) {
            phoneErrorMessage.textContent = 'Por favor, insira um telefone válido';
            phoneErrorMessage.style.display = 'block';
        } else if (!phonePattern.test(phoneValue)) {
            phoneErrorMessage.textContent = 'Por favor, preencha no formato (00) 00000-0000';
            phoneErrorMessage.style.display = 'block';
        } else {
            phoneErrorMessage.style.display = 'none';
        }
    });

    // validação antes de enviar o formulário
    submitButton.addEventListener('click', function (event) {
        const allInputsFilled = inputName.value && inputEmail.value && inputPassword.value &&
                                inputConfirmPassword.value && inputPhone.value;
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
        
        // verifica se todos os campos estão preenchidos e corretos
        if (!allInputsFilled || 
            nameErrorMessage.style.display === 'block' || 
            emailErrorMessage.style.display === 'block' || 
            passwordErrorMessage.style.display === 'block' || 
            !phonePattern.test(inputPhone.value)) {
            
            event.preventDefault(); // Impede o envio do formulário
            alert('Você precisa preencher todos os campos para se cadastrar :/');
        }
    });
});
