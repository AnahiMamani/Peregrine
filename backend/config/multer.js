const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.session.user.viajanteId;  // ID do usuário da sessão
        const dir = path.join(__dirname, `../../uploads/viajantes/${userId}/perfil`);  // Corrigido: uso de crase (``) para interpolação

        // Cria a pasta, se não existir
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Define a pasta de destino para o upload
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'perfil.jpg');  // Nome fixo para a foto de perfil
    }
});

// Inicializa o multer
const upload = multer({ storage });

module.exports = upload;
