//pagina: a_aprovarUsuarios.html

const fileInput1 = document.getElementById('formFile1'); 

const uploadIcon1 = document.getElementById('uploadIcon1');

const proceedArrow = document.getElementById('proceedArrow');

const defaultIconSrc = '/images/icon-arquivoUpload.png';
const doneIconSrc = '/images/icon-arquivoUploadFeito.png';

// Mensagens de erro
const errorMessages = {
    fileInput1: createErrorMessageElement(fileInput1)
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
}

// Função para validar se os arquivos foram anexados
function validateAndProceed(event) {
    const form = document.querySelector('form');
    event.preventDefault();

    let valid = true;

    if (fileInput1.files.length === 0) {
        errorMessages.fileInput1.innerText = "É necessário anexar o documento.";
        errorMessages.fileInput1.style.display = 'block';
        valid = false;
    }

    if (valid) {
        form.submit(); // Envia o formulário
    }
}

proceedArrow.addEventListener('click', validateAndProceed);


// Adicionando listeners para cada input
fileInput1.addEventListener('change', checkUploads);