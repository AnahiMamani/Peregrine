const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_01');
const Viajante = require('../models/Viajante_02');
const SALT_ROUNDS = 10;
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/bd');

// Configurar armazenamento de arquivos com multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Cria a pasta uploads se não existir
        const uploadsDir = path.join(__dirname, '../../uploads');
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir); // Pasta onde os arquivos serão armazenados
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nomeia o arquivo com um identificador único
    }
});
const upload = multer({ storage: storage });

module.exports = {
    cadastroViajante: async (req, res) => {
        const { nome, email, senha, confirmSenha, cpf, dataNascimento, celular, termos } = req.body;

        // Verificar se os campos obrigatórios estão preenchidos
        if (!nome || !email || !senha || !confirmSenha || !cpf || !dataNascimento || !celular || !termos) {
            return res.render('pages/cadastroPage', { error: 'Todos os campos são obrigatórios.' });
        }

        // Verificar se a senha e a confirmação de senha correspondem
        if (senha !== confirmSenha) {
            return res.render('pages/cadastroPage', { error: 'As senhas não coincidem. Tente novamente.' });
        }

        // Verificar se o checkbox de termos foi marcado
        if (!termos) {
            return res.render('pages/cadastroPage', { error: 'Você deve concordar com os termos e condições.' });
        }

        try {
            // Verificar se o email ou CPF já estão cadastrados
            const emailExists = await Usuario.findOne({ where: { A01_EMAIL: email } });
            const cpfExists = await Viajante.findOne({ where: { A02_CPF: cpf } });
            if (emailExists || cpfExists) {
                return res.render('pages/cadastroPage', { error: 'CPF ou Email já cadastrados. Tente novamente.' });
            }

            // Iniciar uma transação para garantir a consistência dos dados
            const transaction = await sequelize.transaction();

            try {
                // Criptografando a senha
                const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

                // Criando o usuário na tabela 'Usuario' com perfil 0
                const usuario = await Usuario.create({
                    A01_EMAIL: email,
                    A01_SENHA: hashedPassword,
                    A01_PERFIL: 0 // Perfil fixo como 0 para usuário comum
                }, { transaction });

                // Criando o viajante na tabela 'Viajante', vinculado ao usuário criado
                await Viajante.create({
                    A01_ID: usuario.A01_ID,  // Relacionando com o 'Usuario'
                    A02_NOME: nome,
                    A02_CPF: cpf,
                    A02_DATA_NACSI: dataNascimento,
                    A02_CELULAR: celular,
                    A01_APROVADA: 0,
                    A01_DOCUMENTACAO: 0
                }, { transaction });

                // Confirmando todas as operações na transação
                await transaction.commit();

                // Enviar email de confirmação
                const transport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    }
                });

                await transport.sendMail({
                    from: 'Peregrine<peregrine.planoviagem@gmail.com>',
                    to: email,
                    subject: 'Confirmação de cadastro',
                    html: '<h1 style="color: #99067E; text-align: center;">Bem-vinda à Peregrine!</h1><p>Olá Peregrina! Estamos muito felizes em ter você a bordo...</p>',
                    text: 'Olá, se não funcionar o HTML, envie esta mensagem.',
                });

                // Armazenar o ID do usuário na sessão e redirecionar
                req.session.userId = usuario.A01_ID;
                res.redirect('/cadastroEnvioDocs');

            } catch (error) {
                // Reverter a transação em caso de erro
                await transaction.rollback();
                console.error("Erro ao gravar os dados:", error);
                res.render('pages/cadastroPage', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
            }

        } catch (error) {
            console.log("Erro ao verificar o cadastro:", error);
            res.render('pages/cadastroPage', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
        }
    },
    uploadDocumentos: (req, res) => {
        const userId = req.session.userId; // Pegue o userId da sessão
        // Verifique se o userId está definido
        if (!userId) {
            return res.status(400).send("User ID não fornecido.");
        }
        const userDir = path.join(__dirname, '../../uploads', userId.toString());
        fs.mkdir(userDir, { recursive: true }, (err) => {
            if (err) {
                console.log("Erro ao criar diretório do usuário:", err);
                return res.status(500).send("Erro ao criar diretório.");
            }
            upload.fields([{ name: 'frenteDoc', maxCount: 1 }, { name: 'versoDoc', maxCount: 1 }, { name: 'selfieDoc', maxCount: 1 }])(req, res, (err) => {
                if (err) {
                    console.log("Erro no upload:", err);
                    return res.status(500).send("Erro ao fazer upload.");
                }
                const frontDoc = req.files['frenteDoc'] ? req.files['frenteDoc'][0] : null;
                const backDoc = req.files['versoDoc'] ? req.files['versoDoc'][0] : null;
                const selfieDoc = req.files['selfieDoc'] ? req.files['selfieDoc'][0] : null;

                if (!frontDoc || !backDoc || !selfieDoc) {
                    return res.status(400).send("Documentos não enviados.");
                }

                const newFileNameSelfie = `selfie_${userId}${path.extname(selfieDoc.originalname)}`;
                const selfieDocPath = path.join(userDir, newFileNameSelfie);

                const newFileNameBack = `backDoc_${userId}${path.extname(backDoc.originalname)}`;
                const backDocPath = path.join(userDir, newFileNameBack);

                // Renomeia o arquivo da selfie para "frontDoc<userId>"
                const newFileNameFront = `frontDoc_${userId}${path.extname(frontDoc.originalname)}`;
                const frontDocPath = path.join(userDir, newFileNameFront); // Caminho com o novo nome

                fs.rename(frontDoc.path, frontDocPath, (err) => {
                    if (err) {
                        console.log("Erro ao mover o documento da frente:", err);
                        return res.status(500).send("Erro ao mover o documento da frente.");
                    }

                    fs.rename(selfieDoc.path, selfieDocPath, (err) => {
                        if (err) {
                            console.log("Erro ao mover o documento de selfie:", err);
                            return res.status(500).send("Erro ao mover o documento de selfie.");
                        }
                    })

                    fs.rename(backDoc.path, backDocPath, async (err) => {
                        if (err) {
                            console.log("Erro ao mover o documento do verso:", err);
                            return res.status(500).send("Erro ao mover o documento do verso.");
                        }

                        try {
                            // Atualiza o campo A01_DOCUMENTACAO_ENVIADA no banco de dados
                            await Viajante.update({ A02_DOCUMENTACAO: true }, { where: { A01_ID: userId } }
                            );

                            console.log("Documentação enviada e banco de dados atualizado com sucesso!");
                            res.redirect('/cadastroEnvioConcluido');
                        } catch (dbError) {
                            console.log("Erro ao atualizar o banco de dados:", dbError);
                            return res.status(500).send("Erro ao atualizar o banco de dados.");
                        }
                    });
                });
            });
        });
    }
}