//pagina: a_aprovarUsuarios.html

const fileInput1 = document.getElementById('formFile1'); 

const uploadIcon1 = document.getElementById('uploadIcon1');

const proceedArrow = document.getElementById('proceedArrow');

const defaultIconSrc = '../public/images/icon-arquivoUpload.png';
const doneIconSrc = '../public/images/icon-arquivoUploadFeito.png';

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
    event.preventDefault(); // Previna o envio do formulário

    let valid = true;

    // Verifica se os inputs estão vazios e exibe mensagens de erro
    if (fileInput1.files.length === 0) {
        errorMessages.fileInput1.innerText = "É necessário anexar o documento.";
        errorMessages.fileInput1.style.display = 'block'; // mostra a mensagem de erro
        valid = false;
    }

    // Se o documento estiver anexado, você pode prosseguir
    if (valid) {
        // Redirecionar para a próxima página ou realizar a ação desejada
        window.location.href = "#"; 
    }
}

// Adicionando listeners para cada input
fileInput1.addEventListener('change', checkUploads);

proceedArrow.addEventListener('click', validateAndProceed);
