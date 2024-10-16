document.addEventListener('DOMContentLoaded', function () {
    const inputName = document.getElementById('inputName'); // Campo de nome
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    const inputPhone = document.getElementById('inputPhone');
    const inputCPF = document.getElementById('inputCPF'); // Campo de CPF
    const inputBirthDate = document.getElementById('inputBirthDate'); // Campo de Data de Nascimento
    const termsCheckbox = document.getElementById('exampleCheck1'); // Checkbox dos termos e condições
    const submitButton = document.querySelector('button[type="submit"]');

    // Mensagens de erro
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

    const cpfErrorMessage = document.createElement('div');
    cpfErrorMessage.className = 'text-danger';
    cpfErrorMessage.style.display = 'none';
    inputCPF.parentNode.insertBefore(cpfErrorMessage, inputCPF.nextSibling);

    const birthDateErrorMessage = document.createElement('div');
    birthDateErrorMessage.className = 'text-danger';
    birthDateErrorMessage.style.display = 'none';
    inputBirthDate.parentNode.insertBefore(birthDateErrorMessage, inputBirthDate.nextSibling);

    const termsErrorMessage = document.createElement('div');
    termsErrorMessage.className = 'text-danger';
    termsErrorMessage.style.display = 'none';
    termsCheckbox.parentNode.insertBefore(termsErrorMessage, termsCheckbox.nextSibling);

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

    // Validação do email (deve conter @)
    inputEmail.addEventListener('input', function () {
        const emailValue = inputEmail.value;
        if (!emailValue.includes('@')) {
            emailErrorMessage.textContent = 'Por favor, insira um email válido';
            emailErrorMessage.style.display = 'block';
        } else {
            emailErrorMessage.style.display = 'none';
        }
    });

    // Validação da senha e confirmação de senha
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

    // Validação do telefone (formato: (00) 00000-0000)
    inputPhone.addEventListener('input', function () {
        const phoneValue = inputPhone.value;
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;

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

    // Validação do CPF (apenas exemplo básico, pode ser expandido)
    inputCPF.addEventListener('input', function () {
        const cpfValue = inputCPF.value;
        if (/[^0-9]/.test(cpfValue) || cpfValue.length !== 11) {
            cpfErrorMessage.textContent = 'Por favor, insira um CPF válido (somente números)';
            cpfErrorMessage.style.display = 'block';
        } else {
            cpfErrorMessage.style.display = 'none';
        }
    });

    // Validação da Data de Nascimento
    inputBirthDate.addEventListener('change', function () {
        if (!inputBirthDate.value) {
            birthDateErrorMessage.textContent = 'Por favor, selecione uma data de nascimento';
            birthDateErrorMessage.style.display = 'block';
        } else {
            birthDateErrorMessage.style.display = 'none';
        }
    });

    submitButton.addEventListener('click', function (event) {
        const allInputsFilled = inputEmail.value && inputPassword.value && inputConfirmPassword.value && inputPhone.value && inputName.value && inputCPF.value && inputBirthDate.value;
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
        const termsChecked = termsCheckbox.checked; // Verifica se o checkbox está marcado

        // Verifica se todos os campos estão preenchidos corretamente e se o checkbox está marcado
        if (!allInputsFilled ||
            emailErrorMessage.style.display === 'block' ||
            passwordErrorMessage.style.display === 'block' ||
            phoneErrorMessage.style.display === 'block' ||
            cpfErrorMessage.style.display === 'block' ||
            birthDateErrorMessage.style.display === 'block' ||
            !phonePattern.test(inputPhone.value) ||
            !termsChecked) {

            event.preventDefault(); // Impede o envio do formulário

            if (!termsChecked) {
                termsErrorMessage.textContent = 'Você deve concordar com os termos e condições';
                termsErrorMessage.style.display = 'block';
            }

            alert('Você precisa preencher todos os campos e aceitar os termos para se cadastrar :/');
        }
    });
});
