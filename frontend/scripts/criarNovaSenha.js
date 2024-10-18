//pagina u_criarNovaSenha.html

document.addEventListener("DOMContentLoaded", function () { 
    const form = document.querySelector("form");
    const newPasswordInput = document.getElementById("newPasswordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");

    // Verifica a senha enquanto o usuário digita no campo nova senha
    newPasswordInput.addEventListener("input", function () {
        const newPassword = newPasswordInput.value.trim();

        // Limpa mensagens de erro anteriores
        clearErrorMessages();

        // Exibe mensagem se a senha não atender aos critérios
        validateNewPassword(newPassword);
    });

    // Verifica as senhas enquanto o usuário digita no campo de confirmação
    confirmPasswordInput.addEventListener("input", function () {
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Limpa mensagens de erro anteriores
        clearErrorMessages();

        // Exibe mensagem se as senhas não coincidem
        if (newPassword !== confirmPassword) {
            showError(confirmPasswordInput, "As senhas não conferem");
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Previna o envio do formulário até que todas as validações sejam feitas

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        let valid = true;

        // Remove mensagens de erro anteriores
        clearErrorMessages();

        // Verifica se os campos estão preenchidos
        if (newPassword === "") {
            showError(newPasswordInput, "Crie uma senha para continuar");
            valid = false;
        }

        if (confirmPassword === "") {
            showError(confirmPasswordInput, "Confirme a senha criada para continuar");
            valid = false;
        }

        // Valida a nova senha
        valid = validateNewPassword(newPassword) && valid;

        // Verifica se as senhas coincidem
        if (newPassword !== confirmPassword) {
            showError(confirmPasswordInput, "As senhas não conferem");
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
            showError(newPasswordInput, "A senha deve ter pelo menos 8 dígitos, incluindo uma letra e um caractere especial");
            return false;
        }
        return true;
    }
});
