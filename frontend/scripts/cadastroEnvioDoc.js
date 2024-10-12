//pagina: u_cadastroEnvioDoc
const fileInput1 = document.getElementById('formFile1');
const fileInput2 = document.getElementById('formFile2');
const uploadIcon1 = document.getElementById('uploadIcon1');
const uploadIcon2 = document.getElementById('uploadIcon2');
const proceedArrow = document.getElementById('proceedArrow');

const defaultIconSrc = '../public/images/icon-arquivoUpload.png';
const doneIconSrc = '../public/images/icon-arquivoUploadFeito.png';

// função para verificar os inputs e alterar as imagens
function checkUploads() {
    if (fileInput1.files.length > 0) {
        uploadIcon1.src = doneIconSrc;
    } else {
        uploadIcon1.src = defaultIconSrc;
    }

    if (fileInput2.files.length > 0) {
        uploadIcon2.src = doneIconSrc;
    } else {
        uploadIcon2.src = defaultIconSrc;
    }
}

// função para verificar se ambos os arquivos estão anexados antes de prosseguir
function validateAndProceed(event) {
    if (fileInput1.files.length === 0 || fileInput2.files.length === 0) {
        event.preventDefault();
        alert("É necessário que você anexe as duas fotos para que prossiga para a próxima página.");
    } else {
        // se ambos os inputs estiverem preenchidos, redirecionar para a próxima página
        window.location.href = "#"; 
    }
}

// adicionando listeners para cada input
fileInput1.addEventListener('change', checkUploads);
fileInput2.addEventListener('change', checkUploads);
proceedArrow.addEventListener('click', validateAndProceed);