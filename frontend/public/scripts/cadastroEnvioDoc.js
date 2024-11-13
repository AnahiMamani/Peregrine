//pagina: u_cadastroEnvioDoc

const fileInput1 = document.getElementById('formFile1'); 
const fileInput2 = document.getElementById('formFile2');
const fileInput3 = document.getElementById('formFile3');

const uploadIcon1 = document.getElementById('uploadIcon1');
const uploadIcon2 = document.getElementById('uploadIcon2');
const uploadIcon3 = document.getElementById('uploadIcon3');

const proceedArrow = document.getElementById('proceedArrow');

const defaultIconSrc = '/images/icon-arquivoUpload.png';
const doneIconSrc = '/images/icon-arquivoUploadFeito.png';

// Mensagens de erro
const errorMessages = {
    fileInput1: createErrorMessageElement(fileInput1),
    fileInput2: createErrorMessageElement(fileInput2),
    fileInput3: createErrorMessageElement(fileInput3)
};

// Função para criar um elemento de mensagem de erro
function createErrorMessageElement(input) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'text-danger';
    errorMessage.style.display = 'none'; 
    input.parentNode.insertBefore(errorMessage, input.nextSibling);
    return errorMessage;
}

// Função para verificar os inputs e alterar as imagens
function checkUploads() {
    if (fileInput1.files.length > 0) {
        uploadIcon1.src = doneIconSrc;
        errorMessages.fileInput1.style.display = 'none'; // Limpa mensagem de erro
    } else {
        uploadIcon1.src = defaultIconSrc;
    }

    if (fileInput2.files.length > 0) {
        uploadIcon2.src = doneIconSrc;
        errorMessages.fileInput2.style.display = 'none'; // Limpa mensagem de erro
    } else {
        uploadIcon2.src = defaultIconSrc;
    }

    if (fileInput3.files.length > 0) {
        uploadIcon3.src = doneIconSrc;
        errorMessages.fileInput3.style.display = 'none'; // Limpa mensagem de erro
    } else {
        uploadIcon3.src = defaultIconSrc;
    }
}

// Função para validar se os arquivos foram anexados
function validateAndProceed(event) {
    event.preventDefault(); // Previna o envio do formulário

    let valid = true;

    // Verifica se os inputs estão vazios e exibe mensagens de erro
    if (fileInput1.files.length === 0) {
        errorMessages.fileInput1.innerText = "É necessário anexar o documento 1.";
        errorMessages.fileInput1.style.display = 'block'; // Mostra a mensagem de erro
        valid = false;
    }

    if (fileInput2.files.length === 0) {
        errorMessages.fileInput2.innerText = "É necessário anexar o documento 2.";
        errorMessages.fileInput2.style.display = 'block'; // Mostra a mensagem de erro
        valid = false;
    }

    if (fileInput3.files.length === 0) {
        errorMessages.fileInput3.innerText = "É necessário anexar o documento 3.";
        errorMessages.fileInput3.style.display = 'block'; // Mostra a mensagem de erro
        valid = false;
    }

    // Se todos os documentos estiverem anexados, você pode prosseguir
    if (valid) {
        // Redirecionar para a próxima página ou realizar a ação desejada
        window.location.href = "#"; // Exemplo de redirecionamento
    }
}

// Adicionando listeners para cada input
fileInput1.addEventListener('change', checkUploads);
fileInput2.addEventListener('change', checkUploads);
fileInput3.addEventListener('change', checkUploads);

proceedArrow.addEventListener('click', validateAndProceed);
