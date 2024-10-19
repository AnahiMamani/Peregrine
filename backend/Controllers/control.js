const bcrypt = require('bcrypt');
const cadastro = require("../models/dados");
const saltRounds = 10; // Define o número de salt rounds para o hash da senha
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const crypto = require('crypto'); // Para gerar o código de verificação
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        res.render('pages/indexPage', {
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
    renderAdmin: (req, res) => {
        res.render('pages/adminPage', {
            title: 'Administrador - Página Inicial',
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
    
        //se tudo ok prosseguir com o hash da senha e a criação do usuário
        try {
            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            
            const usuario = await cadastro.create({
                A01_NOME: nome,
                A01_EMAIL: email,
                A01_SENHA: hashedPassword,
                A01_CPF: cpf,
                A01_DATA_NASCIMENTO: dataNascimento,
                A01_CELULAR: celular
            });
    
            //Enviando email de confirmação
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
                subject: 'Bem-vindo ao Peregrine!',
                html: `
                    <h1 style="color: #99067E; text-align: center;">Bem-vindo ao Peregrine!</h1>
                    <p style="text-align: justify;">Olá ${nome},</p>
                    <p style="text-align: justify;">
                        Seu cadastro foi realizado com sucesso! Estamos felizes em tê-lo conosco no <strong>Peregrine</strong>.
                    </p>
                    <p style="text-align: justify;">
                        ${!usuario.A01_DOCUMENTACAO_ENVIADA ? 
                            'Para acessar todas as funcionalidades do nosso site, pedimos que envie sua documentação. Assim que recebermos, você terá acesso completo ao nosso conteúdo.' 
                            : 
                            'Caso já tenha enviado sua documentação, por favor, desconsidere este aviso.'
                        }
                    </p>
                    <p style="text-align: justify;">
                        Caso tenha alguma dúvida, entre em contato conosco. 
                    </p>
                    <p style="text-align: justify;">Atenciosamente,</p>
                    <p style="text-align: justify;"><strong>Equipe Peregrine ✈️</strong></p>
                    <br><br><hr>
                    <h4 style="color: #777; text-align: center;">Este é um e-mail automático, por favor, não responda.</h4>
                `,
                text: `Olá ${nome}, seu cadastro foi realizado com sucesso! ${!usuario.A01_DOCUMENTACAO_ENVIADA ? 
                    'Para acessar todas as funcionalidades do nosso site, pedimos que envie sua documentação. Assim que recebermos, você terá acesso completo ao nosso conteúdo.' 
                    : 
                    'Caso já tenha enviado sua documentação, por favor, desconsidere este aviso.'
                }`,
            });
            req.session.userId = usuario.A01_ID; // Armazena o ID do usuário na sessão
            res.redirect('/cadastroEnvioDocs');
        } catch (error) {
            console.log("Erro ao gravar os dados:", error);
            res.render('pages/cadastroPage', { error: 'Erro ao cadastrar, CPF ou Email já cadastrados. Tente novamente.' });
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
                            await cadastro.update({ A01_DOCUMENTACAO_ENVIADA: true }, { where: { A01_ID: userId } }
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
            const user = await cadastro.findOne({ where: { A01_EMAIL: email } });
    
            if (user && await bcrypt.compare(senha, user.A01_SENHA)) {
    
                // Verifica se a documentação foi enviada
                if (!user.A01_DOCUMENTACAO_ENVIADA) {
                    req.session.userId = user.A01_ID; // Armazena o ID do usuário na sessão
                    return res.render('pages/cadastroEnvioDocs'); // Redireciona para a tela de envio de documentos
                }
    
                // Verifica se a conta foi aprovada
                if (!user.A01_CONTA_APROVADA) {
                    return res.render('pages/cadastroEnvioConcluido', { error: 'Sua conta ainda não foi aprovada.' });
                }
    
                // Verifica se o usuário é administrador
                if (user.A01_ISADMIN) {
                    // Armazena o status do administrador na sessão
                    req.session.user = {
                        nome: user.A01_NOME,
                        email: user.A01_EMAIL,
                        isAdmin: true
                    };
                    return res.redirect('/administrador'); // Redireciona para a tela do administrador
                } else {
                    // Usuário comum
                    req.session.user = {
                        nome: user.A01_NOME,
                        email: user.A01_EMAIL,
                        isAdmin: false
                    };
                    // Redireciona para a página inicial do usuário comum
                    return res.redirect('/');
                }
            } else {
                // Credenciais inválidas
                res.render('pages/loginPage', { error: 'Email ou senha incorretos!' });
            }
        } catch (error) {
            console.error('Erro ao realizar o login:', error);
            // Renderiza a página de login com a mensagem de erro
            res.render('pages/loginPage', { error: 'Erro ao realizar o login. Tente novamente mais tarde.' });
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
            const user = await cadastro.findOne({ where: { A01_EMAIL: email } });

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
            await cadastro.update({ A01_SENHA: hashedPassword }, { where: { A01_EMAIL: email } });

            req.session.verificationCode = null;
            req.session.emailRecuperacao = null;

            res.render('pages/senhaAlteradaSucesso', { senhaSuccess: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            res.render('pages/senhaCriarNova', { senhaError: 'Erro ao atualizar a senha. Tente novamente.' });
        }
    }
}