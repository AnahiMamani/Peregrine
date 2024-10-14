//pagina u_criarNovaSenha.html

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const newPasswordInput = document.getElementById("newPasswordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");

    // verifica a senha enquanto o usuário digita no campo nova senha
    newPasswordInput.addEventListener("input", function () {
        const newPassword = newPasswordInput.value.trim();

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // exibe mensagem se a senha for menor que 8 caracteres
        if (newPassword.length < 8) {
            showError(newPasswordInput, "A senha deve ter no mínimo 8 caracteres");
        }
    });

    // verifica as senhas enquanto o usuário digita no campo de confirmação
    confirmPasswordInput.addEventListener("input", function () {
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // exibe mensagem se as senhas não coincidem
        if (newPassword !== confirmPassword) {
            showError(confirmPasswordInput, "As senhas não conferem");
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // previne o envio do formulário até que todas as validações sejam feitas

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        let valid = true;

        // remove mensagens de erro anteriores
        clearErrorMessages();

        // verifica se a senha tem no mínimo 8 caracteres
        if (newPassword.length < 8) {
            showError(newPasswordInput, "A senha deve ter no mínimo 8 caracteres");
            valid = false;
        }

        // verifica se as senhas coincidem
        if (newPassword !== confirmPassword) {
            showError(confirmPasswordInput, "As senhas não conferem");
            valid = false;
        }

        // verifica se os campos estão preenchidos
        if (newPassword === "" || confirmPassword === "") {
            alert("Você precisa preencher todos os campos para criar sua nova senha :/");
            valid = false;
        }

        // se tudo estiver válido, submete o formulário
        if (valid) {
            form.submit();
        }
    });

    function showError(input, message) {
        // verifica se já existe uma mensagem de erro antes de adicionar
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
});

