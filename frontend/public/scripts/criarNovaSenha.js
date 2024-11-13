//pagina u_criarNovaSenha.html

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');

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

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Previna o envio do formulário até que todas as validações sejam feitas

        const newPassword = inputPassword.value.trim();
        const confirmPassword = inputConfirmPassword.value.trim();
        let valid = true;

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

        // Se tudo estiver válido, submete o formulário
        if (valid) {
            form.submit();
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
});
