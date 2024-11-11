const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_01'); // Verifique o caminho correto do arquivo de modelo
const Viajante = require('../models/Viajante_02');

const saltRounds = 10; // Define o número de salt rounds para o hash da senha
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const crypto = require('crypto'); // Para gerar o código de verificação
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
    renderIndex: (req, res) => {
        res.render('pages/telaInicial', {
            title: 'Página Inicial',
            user: req.session.user // Passa os dados do usuário logado
        });
    },

    renderPerfil: (req, res) => {
        res.render('pages/perfilPage', {
            title: 'perfil',
            user: req.session.user
        });
    },

    renderLogin: (req, res) => {
        res.render("pages/loginPage", {
            title: 'Login'
        });
    },

    renderCadastro: (req, res) => {
        res.render("pages/cadastroPage", {
            title: 'Cadastro'
        });
    },

    renderCadastroEnvioDocs: (req, res) => {
        res.render("pages/cadastroEnvioDocs", {
            title: 'Cadastro'
        });
    },

    renderCadastroEnvioConcluido: (req, res) => {
        res.render("pages/cadastroEnvioConcluido", {
            title: 'Cadastro'
        });
    },

    renderCadastroTermos: (req, res) => {
        res.render("pages/cadastroTermos", {
            title: 'Termos e Condições'
        });
    },

    renderSenhaAlteradaSucesso: (req, res) => {
        res.render("pages/senhaAlteradaSucesso", {
            title: 'Senha Alterada'
        });
    },

    renderSenhaCodigoRecuperacao: (req, res) => {
        res.render("pages/senhaCodigoRecuperacao", {
            title: 'Codigo de Recuperação'
        });
    },

    renderSenhaCriarNova: (req, res) => {
        res.render("pages/senhaCriarNova", {
            title: 'Criando nova Senha'
        });
    },

    renderSenhaRecuperar: (req, res) => {
        res.render("pages/senhaRecuperar", {
            title: 'Esqueci minha senha'
        });
    },

// Função de cadastro de usuário e viajante
funcadastro: async (req, res) => {
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
            const hashedPassword = await bcrypt.hash(senha, saltRounds);

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
    },

    login: async (req, res) => {
        const { email, senha } = req.body;
        try {
            const user = await Usuario.findOne({ where: { A01_EMAIL: email } });
    
            if (!user) {
                return res.render('pages/loginPage', { error: 'Usuário não encontrado!' });
            }
    
            if (await bcrypt.compare(senha, user.A01_SENHA)) {
    
                // Verifica se o usuário é administrador
                if (user.A01_PERFIL === 1) { // Perfil 1 para administrador
                    req.session.user = {
                        nome: user.A01_NOME,
                        email: user.A01_EMAIL,
                        isAdmin: true
                    };
                    return res.redirect('/administrador/indexAdmin'); // Redireciona para a tela do administrador
                } else {
                    // Busca informações adicionais do viajante na tabela viajante_02
                    const viajante = await Viajante.findOne({ where: { A01_ID: user.A01_ID } });
    
                    if (!viajante) {
                        return res.render('pages/loginPage', { error: 'Viajante não encontrado!' });
                    }
    
                    // Verifica se a documentação foi enviada
                    if (!viajante.A02_DOCUMENTACAO) {
                        req.session.userId = user.A01_ID; // Armazena o ID do usuário na sessão
                        return res.render('pages/cadastroEnvioDocs'); // Redireciona para a tela de envio de documentos
                    }
    
                    // Verifica se a conta foi aprovada
                    if (!viajante.A02_APROVADA) {
                        return res.render('pages/cadastroEnvioConcluido', { error: 'Sua conta ainda não foi aprovada.' });
                    }
    
                    // Usuário comum
                    req.session.user = {
                        nome: viajante.A02_NOME,
                        email: user.A01_EMAIL,
                        isAdmin: false
                    };
                    return res.redirect('/');
                }
            } else {
                return res.render('pages/loginPage', { error: 'Email ou senha incorretos!' });
            }
        } catch (error) {
            console.error('Erro ao realizar o login:', error);
            return res.render('pages/loginPage', { error: 'Erro ao realizar o login. Tente novamente mais tarde.' });
        }
    },
    

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log('Erro ao encerrar a sessão:', err);
                return res.redirect('/'); // Redireciona mesmo se houver erro ao encerrar a sessão
            }
            // Sessão encerrada com sucesso, redireciona para a página inicial
            res.redirect('/');
        });
    },

    funRecuperarSenha: async (req, res) => {
        const { email } = req.body;
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        if (!email) {
            return res.render('pages/senhaRecuperar', { error: 'O campo de e-mail está vazio.' });
        }

        try {
            const user = await Usuario.findOne({ where: { A01_EMAIL: email } });

            if (user) {
                const verificationCode = crypto.randomInt(100000, 999999);
                req.session.verificationCode = verificationCode;
                req.session.emailRecuperacao = email; // Armazenar o email na sessão

                await transport.sendMail({
                    from: 'Peregrine<peregrine.planoviagem@gmail.com>',
                    to: email,
                    subject: 'Recuperação de senha - Peregrine',
                    html: `
                        <h1 style="color: #99067E; text-align: center;">Recuperação de senha</h1>
                        <p style="text-align: justify;">Olá Peregrina,</p>
                        <p style="text-align: justify;">
                            Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Peregrine</strong>.
                            Se você fez essa solicitação, use o código abaixo para concluir o processo de recuperação:
                        </p>
                        <h2 style="color: #FF5733; text-align: center;">${verificationCode}</h2>
                        <p style="text-align: justify;">
                            Caso você não tenha solicitado a recuperação, por favor ignore este e-mail.
                        </p>
                        <p style="text-align: justify;">Estamos à disposição para ajudá-la em caso de dúvidas.</p>
                        <br>
                        <p style="text-align: justify;">Atenciosamente,</p>
                        <p style="text-align: justify;"><strong>Equipe Peregrine ✈️</strong></p>
                        <br><br><hr>
                        <h4 style="color: #777; text-align: center;">Este é um e-mail automático, por favor, não responda.</h4>
                        <h4 style="color: #777; text-align: center;">Você está recebendo esta mensagem porque solicitou a recuperação de senha no <strong>Peregrine</strong>.</h4>
                    `,
                    text: `Seu código de verificação é: ${verificationCode}`,
                });

                console.log('E-mail enviado com sucesso');
                res.render('pages/senhaCodigoRecuperacao', {
                    success: 'Código enviado no seu e-mail. Insira o código aqui:',
                    showCodeField: true,
                    email
                });
            } else {
                res.render('pages/senhaRecuperar', { error: 'Email não encontrado!' });
            }

        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            res.render('pages/senhaRecuperar', { error: 'Erro ao tentar enviar o e-mail. Tente novamente.' });
        }
    },

    validaCodigo: (req, res) => {
        const { codigo, email } = req.body;
        const codigoEnviado = req.session.verificationCode;

        if (codigo === String(codigoEnviado)) {
            req.session.verificationCode = null;
            res.redirect('/senhaCriarNova');
        } else {
            res.render('pages/senhaCodigoRecuperacao', {
                error: 'Código inválido. Tente novamente.',
                showCodeField: true,
                email: req.session.emailRecuperacao // Passa o email para a renderização da página
            });
        }
    },

    atualizarSenha: async (req, res) => {
        const { novaSenha, confirmarSenha } = req.body;
        const email = req.session.emailRecuperacao;

        if (!novaSenha || !confirmarSenha) {
            return res.render('pages/senhaCriarNova', { senhaError: 'Preencha todos os campos.' });
        }
        if (novaSenha !== confirmarSenha) {
            return res.render('pages/senhaCriarNova', { senhaError: 'As senhas não coincidem.' });
        }
        try {
            const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);
            await Usuario.update({ A01_SENHA: hashedPassword }, { where: { A01_EMAIL: email } });

            req.session.verificationCode = null;
            req.session.emailRecuperacao = null;

            res.render('pages/senhaAlteradaSucesso', { senhaSuccess: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            res.render('pages/senhaCriarNova', { senhaError: 'Erro ao atualizar a senha. Tente novamente.' });
        }
    }
}