//pagina u_cadastro.html

document.addEventListener('DOMContentLoaded', function () {
    const inputName = document.getElementById('inputName'); // campo de nome
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    const inputPhone = document.getElementById('inputPhone');
    const inputCPF = document.getElementById('inputCPF'); // campo de CPF
    const inputBirthDate = document.getElementById('inputBirthDate'); // campo de Data de Nascimento
    const termsCheckbox = document.getElementById('exampleCheck1'); // checkbox dos termos e condições
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

    // Validação da senha e confirmação de senha (mínimo 8 caracteres, uma letra e um caractere especial)
    function validatePassword() {
        const passwordValue = inputPassword.value;
        const confirmPasswordValue = inputConfirmPassword.value;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordPattern.test(passwordValue)) {
            passwordErrorMessage.textContent = 'A senha deve conter no mínimo 8 dígitos, uma letra e um caractere especial';
            passwordErrorMessage.style.display = 'block';
        } else if (passwordValue !== confirmPasswordValue) {
            passwordErrorMessage.textContent = 'As senhas não conferem';
            passwordErrorMessage.style.display = 'block';
        } else {
            passwordErrorMessage.style.display = 'none';
        }
    }

    inputPassword.addEventListener('input', validatePassword);
    inputConfirmPassword.addEventListener('input', validatePassword);

    // Máscara e validação do telefone (formato: (00) 00000-0000)
    inputPhone.addEventListener('input', function () {
        let phoneValue = inputPhone.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        phoneValue = phoneValue.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        inputPhone.value = phoneValue;

        if (phoneValue.length !== 11) {
            phoneErrorMessage.textContent = 'Por favor, insira um telefone válido com 11 algarismos (DDD + telefone)';
            phoneErrorMessage.style.display = 'block';
        } else {
            phoneErrorMessage.style.display = 'none';
        }
    });

    // Máscara e validação do CPF (formato: 000.000.000-00)
    inputCPF.addEventListener('input', function () {
        let cpfValue = inputCPF.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        cpfValue = cpfValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
        inputCPF.value = cpfValue;

        if (cpfValue.length !== 11) {
            cpfErrorMessage.textContent = 'Por favor, insira um CPF válido com 11 algarismos. Se conter letra, substitua por 0';
            cpfErrorMessage.style.display = 'block';
        } else {
            cpfErrorMessage.style.display = 'none';
        }
    });

    // Validação da data de nascimento (usuário deve ser maior de idade)
    inputBirthDate.addEventListener('change', function () {
        const birthDateValue = new Date(inputBirthDate.value);
        const today = new Date();
        let age = today.getFullYear() - birthDateValue.getFullYear();
        const m = today.getMonth() - birthDateValue.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateValue.getDate())) {
            age--;
        }

        if (age < 18) {
            birthDateErrorMessage.textContent = 'Você deve ser maior de idade para se cadastrar';
            birthDateErrorMessage.style.display = 'block';
        } else {
            birthDateErrorMessage.style.display = 'none';
        }
    });

    // Verificação de todos os campos antes do envio
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Impede o envio do formulário inicialmente

        // Limpar mensagens de erro antes da validação
        nameErrorMessage.style.display = 'none';
        emailErrorMessage.style.display = 'none';
        passwordErrorMessage.style.display = 'none';
        phoneErrorMessage.style.display = 'none';
        cpfErrorMessage.style.display = 'none';
        birthDateErrorMessage.style.display = 'none';
        termsErrorMessage.style.display = 'none';

        // Verifica se os campos estão preenchidos
        if (!inputName.value) {
            nameErrorMessage.textContent = 'Preencha seu nome para continuar';
            nameErrorMessage.style.display = 'block';
        }
        if (!inputEmail.value) {
            emailErrorMessage.textContent = 'Preencha seu e-mail para continuar';
            emailErrorMessage.style.display = 'block';
        }
        if (!inputPassword.value) {
            passwordErrorMessage.textContent = 'Preencha sua senha para continuar';
            passwordErrorMessage.style.display = 'block';
        }
        if (!inputConfirmPassword.value) {
            passwordErrorMessage.textContent = 'Preencha os dois campos de senha para continuar';
            passwordErrorMessage.style.display = 'block';
        }
        if (!inputPhone.value) {
            phoneErrorMessage.textContent = 'Preencha seu telefone para continuar';
            phoneErrorMessage.style.display = 'block';
        }
        if (!inputCPF.value) {
            cpfErrorMessage.textContent = 'Preencha seu CPF para continuar';
            cpfErrorMessage.style.display = 'block';
        }
        if (!inputBirthDate.value) {
            birthDateErrorMessage.textContent = 'Preencha sua data de nascimento para continuar';
            birthDateErrorMessage.style.display = 'block';
        }
        if (!termsCheckbox.checked) {
            termsErrorMessage.textContent = 'Você deve concordar com os termos e condições';
            termsErrorMessage.style.display = 'block';
        }

        // Se não houver erros, envia o formulário
        if (inputName.value && inputEmail.value && inputPassword.value && inputConfirmPassword.value && inputPhone.value && inputCPF.value && inputBirthDate.value && termsCheckbox.checked) {
            event.target.form.submit(); // Envia o formulário se todas as validações forem bem-sucedidas
        }
    });
});
