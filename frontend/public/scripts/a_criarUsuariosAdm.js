//pagina a_criarUsuariosAdm.html

document.addEventListener("DOMContentLoaded", function () {
    const nomeInput = document.getElementById("inputNameAdm");
    const emailInput = document.getElementById("inputEmailAdm");
    const cpfInput = document.getElementById("inputCPFAdm");
    const phoneInput = document.getElementById("inputPhoneAdm");
    const passwordInput = document.getElementById("inputPasswordAdm");
    const confirmPasswordInput = document.getElementById("inputConfirmPasswordAdm");
    const submitButton = document.querySelector('button[type="submit"]');

    const showError = (input, message) => {
        let errorElem = input.nextElementSibling;
        if (!errorElem || !errorElem.classList.contains("error")) {
            errorElem = document.createElement("small");
            errorElem.classList.add("error");
            errorElem.style.color = "red";
            input.parentNode.insertBefore(errorElem, input.nextSibling);
        }
        errorElem.textContent = message;
    };

    const clearError = (input) => {
        const errorElem = input.nextElementSibling;
        if (errorElem && errorElem.classList.contains("error")) {
            errorElem.textContent = "";
        }
    };

    //insere mensagem de erro se um campo não estiver preenchido
    const validateNotEmpty = (input) => {
        if (input.value.trim() === "") {
            showError(input, "Preencha este campo para continuar");
            return false;
        }
        clearError(input);
        return true;
    };

    // Valida o campo nome (deve conter apenas letras)
    const validateNome = () => {
        if (!validateNotEmpty(nomeInput)) return false;
        const regex = /^[A-Za-z\s]+$/;
        if (!regex.test(nomeInput.value.trim())) {
            showError(nomeInput, "O campo nome deve conter apenas letras.");
            return false;
        }
        clearError(nomeInput);
        return true;
    };

    // Valida o campo e-mail (deve conter @ e pelo menos um ponto)
    const validateEmail = () => {
        if (!validateNotEmpty(emailInput)) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(emailInput.value.trim())) {
            showError(emailInput, "Insira um e-mail válido.");
            return false;
        }
        clearError(emailInput);
        return true;
    };

    // Valida o número de dígitos do cpf (somente os números, sem formatação)
    const validateCPF = () => {
        if (!validateNotEmpty(cpfInput)) return false;
        const regex = /^\d{11}$/;
        const cpfValue = cpfInput.value.replace(/\D/g, "");
        if (!regex.test(cpfValue)) {
            showError(cpfInput, "Insira um CPF válido com 11 algarismos. Se conter letra, substitua por 0");
            return false;
        }
        clearError(cpfInput);
        return true;
    };

    // Valida o número de dígitos do telefone (somente os números, sem formatação)
    const validatePhone = () => {
        if (!validateNotEmpty(phoneInput)) return false;
        const regex = /^\d{11}$/;
        const phoneValue = phoneInput.value.replace(/\D/g, "");
        if (!regex.test(phoneValue)) {
            showError(phoneInput, "O telefone deve ter exatamente 11 números.");
            return false;
        }
        clearError(phoneInput);
        return true;
    };

    // Valida o campo de criação de senha (8 caracteres, uma letra e um caractere especial)
    const validatePassword = () => {
        if (!validateNotEmpty(passwordInput)) return false;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!regex.test(passwordInput.value)) {
            showError(passwordInput, "A senha deve ter no mínimo 8 caracteres, incluindo uma letra e um caractere especial.");
            return false;
        }
        clearError(passwordInput);
        return true;
    };

    // Valida o campo de confirmação de senha (os campos senha e confirmação devem ser iguais)    
    const validateConfirmPassword = () => {
        if (!validateNotEmpty(confirmPasswordInput)) return false;
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordInput, "As senhas não conferem.");
            return false;
        }
        clearError(confirmPasswordInput);
        return true;
    };

    // Adiciona a máscara para telefone (formato (00) 00000-0000)
    const applyPhoneMask = () => {
        let value = phoneInput.value.replace(/\D/g, "");
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
        }
        phoneInput.value = value;
    };

    // Adiciona a máscara para cpf (formato 000.000.000-00)
    const applyCPFMask = () => {
        let value = cpfInput.value.replace(/\D/g, "");
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
        cpfInput.value = value;
    };

    nomeInput.addEventListener("input", validateNome);
    emailInput.addEventListener("input", validateEmail);
    cpfInput.addEventListener("input", () => {
        applyCPFMask();
        validateCPF();
    });
    phoneInput.addEventListener("input", () => {
        applyPhoneMask();
        validatePhone();
    });
    passwordInput.addEventListener("input", validatePassword);
    confirmPasswordInput.addEventListener("input", validateConfirmPassword);

    // Verificação de todos os campos antes do envio
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        const isNomeValid = validateNome();
        const isEmailValid = validateEmail();
        const isCPFValid = validateCPF();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isNomeValid && isEmailValid && isCPFValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
            event.target.form.submit();
        } 
    });
});
