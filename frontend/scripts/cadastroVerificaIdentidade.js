//pagina u_cadastroVerificaIdentidade
document.addEventListener('DOMContentLoaded', function () {
    const uploadIcon3 = document.getElementById('uploadIcon3');
    const formFile3 = document.getElementById('formFile3');

    //altera a imagem do ícone quando um arquivo é selecionado ou removido
    formFile3.addEventListener('change', function () {
        if (formFile3.files.length > 0) {
            uploadIcon3.src = '../public/images/icon-arquivoUploadFeito.png'; 
        } else {
            uploadIcon3.src = '../public/images/icon-arquivoUpload.png'; // Retorna à imagem padrão
        }
    });

    const inputName = document.getElementById('inputName');
    const inputCPF = document.getElementById('inputCPF');
    const inputBirthDate = document.getElementById('inputBirthDate');
    const submitButton = document.querySelector('button[type="submit"]');

    //mensagens de erro
    const nameErrorMessage = document.createElement('div');
    nameErrorMessage.className = 'text-danger';
    nameErrorMessage.style.display = 'none'; 
    inputName.parentNode.insertBefore(nameErrorMessage, inputName.nextSibling);

    const cpfErrorMessage = document.createElement('div');
    cpfErrorMessage.className = 'text-danger';
    cpfErrorMessage.style.display = 'none';
    inputCPF.parentNode.insertBefore(cpfErrorMessage, inputCPF.nextSibling);

    const ageErrorMessage = document.createElement('div');
    ageErrorMessage.className = 'text-danger';
    ageErrorMessage.style.display = 'none';
    inputBirthDate.parentNode.insertBefore(ageErrorMessage, inputBirthDate.nextSibling);

    // Validação do nome
    inputName.addEventListener('input', function () {
        const nameValue = inputName.value;
        if (/[^a-zA-ZÀ-ÿ\s]/.test(nameValue) || nameValue.trim() === '') {
            nameErrorMessage.textContent = 'Preencha com um nome válido';
            nameErrorMessage.style.display = 'block';
        } else {
            nameErrorMessage.style.display = 'none';
        }
    });

    // Validação do CPF
    inputCPF.addEventListener('input', function () {
        const cpfValue = inputCPF.value;
        if (!/^\d*$/.test(cpfValue)) {
            cpfErrorMessage.textContent = 'Se seu CPF contém letras, substitua por 0';
            cpfErrorMessage.style.display = 'block';
        } else if (cpfValue.length > 11) {
            cpfErrorMessage.textContent = 'CPF contém apenas 11 dígitos';
            cpfErrorMessage.style.display = 'block';
        } else {
            cpfErrorMessage.style.display = 'none';
        }
    });

    // validação da data de nascimento
    inputBirthDate.addEventListener('change', function () {
        const birthDateValue = new Date(inputBirthDate.value);
        const today = new Date();
        
        // calcula a idade
        let age = today.getFullYear() - birthDateValue.getFullYear();
        const m = today.getMonth() - birthDateValue.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateValue.getDate())) {
            age--;
        }

        // verifica se a idade é inferior a 18 anos
        if (age < 18) {
            ageErrorMessage.textContent = 'Você deve ser maior de idade para se cadastrar';
            ageErrorMessage.style.display = 'block';
        } else {
            ageErrorMessage.style.display = 'none';
        }
    });

    // validação antes de enviar o formulário
    submitButton.addEventListener('click', function (event) {
        const allInputsFilled = inputName.value && inputCPF.value && inputBirthDate.value && formFile3.files.length > 0;
        if (!allInputsFilled) {
            event.preventDefault(); // impede o envio do formulário sem tudo estar preenchido
            alert('Você deve preencher todos os campos para conseguir enviar seu cadastro :/');
        }
    });
});
