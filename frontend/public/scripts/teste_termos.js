//pagina u_cadastro.html

document.addEventListener('DOMContentLoaded', function () {
    const inputName = document.getElementById('inputName'); // campo de nome
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    const inputPhone = document.getElementById('inputPhone');
    const inputCPF = document.getElementById('inputCPF'); // campo de CPF
    const inputBirthDate = document.getElementById('inputBirthDate'); // campo de Data de Nascimento
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

    // Verifica a senha enquanto o usuário digita no campo nova senha
    inputPassword.addEventListener("input", function () {
        const newPassword = inputPassword.value.trim();

        // Limpa mensagens de erro anteriores
        clearErrorMessages();

        // Exibe mensagem se a senha não atender aos critérios
        validateNewPassword(newPassword);
    });

    // Verifica as senhas enquanto o usuário digita no campo de confirmação
    inputConfirmPassword.addEventListener("input", function () {
        const newPassword = inputPassword.value.trim();
        const confirmPassword = inputConfirmPassword.value.trim();

        // Limpa mensagens de erro anteriores
        clearErrorMessages();

        // Exibe mensagem se as senhas não coincidem
        if (newPassword !== confirmPassword) {
            showError(inputConfirmPassword, "As senhas não conferem");
        }
    });

    function showError(input, message) {
        // Verifica se já existe uma mensagem de erro antes de adicionar
        if (!input.parentElement.querySelector(".text-danger")) {
            const errorElement = document.createElement("div");
            errorElement.className = "text-danger mt-1";
            errorElement.innerText = message;
            input.parentElement.appendChild(errorElement);
        }
    }

    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll(".text-danger");
        errorMessages.forEach(function (message) {
            message.remove();
        });
    }

    function validateNewPassword(password) {
        const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Mínimo 8 caracteres, 1 letra, 1 caractere especial
        if (!passwordCriteria.test(password)) {
            showError(inputPassword, "A senha deve ter pelo menos 8 dígitos, incluindo uma letra e um caractere especial");
            return false;
        }
        return true;
    }

    // Máscara e validação do telefone (formato: (00) 00000-0000)
    inputPhone.addEventListener('input', function () {
        let phoneValue = inputPhone.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

        // Limita a entrada a 11 dígitos
        if (phoneValue.length > 11) {
            phoneValue = phoneValue.slice(0, 11);
        }

        // Aplica a máscara
        inputPhone.value = phoneValue.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');

        // Valida o número de dígitos (somente os números, sem formatação)
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

        // Limita a entrada a 11 dígitos
        if (cpfValue.length > 11) {
            cpfValue = cpfValue.slice(0, 11);
        }

        // Aplica a máscara
        inputCPF.value = cpfValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');

        // Valida o número de dígitos (somente os números, sem formatação)
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
        const newPassword = inputPassword.value.trim();
        const confirmPassword = inputConfirmPassword.value.trim();
        let valid = true;

        // Limpar mensagens de erro antes da validação
        nameErrorMessage.style.display = 'none';
        emailErrorMessage.style.display = 'none';
        passwordErrorMessage.style.display = 'none';
        phoneErrorMessage.style.display = 'none';
        cpfErrorMessage.style.display = 'none';
        birthDateErrorMessage.style.display = 'none';

        // Remove mensagens de erro anteriores
        clearErrorMessages();

        // Verifica se os campos estão preenchidos
        if (newPassword === "") {
            showError(inputPassword, "Crie uma senha para continuar");
            valid = false;
        }

        if (confirmPassword === "") {
            showError(inputConfirmPassword, "Confirme a senha criada para continuar");
            valid = false;
        }

        // Valida a nova senha
        valid = validateNewPassword(newPassword) && valid;

        // Verifica se as senhas coincidem
        if (newPassword !== confirmPassword) {
            showError(inputConfirmPassword, "As senhas não conferem");
            valid = false;
        }
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

        // Se não houver erros, envia o formulário
        if (inputName.value && inputEmail.value && inputPassword.value && inputConfirmPassword.value && inputPhone.value && inputCPF.value && inputBirthDate.value && valid) {
            event.target.form.submit(); // Envia o formulário se todas as validações passarem
        }
    });
});
