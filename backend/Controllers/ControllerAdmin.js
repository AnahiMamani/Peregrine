const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_01');
const Viajante = require('../models/Viajante_02');
const Denuncia = require('../models/Denuncia_05')
const sequelize = require('../config/bd');
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const nodemailer = require('nodemailer');
const { cancelarDenuncia } = require('../Boundary/BoundaryAdmin');
const SALT_ROUNDS = 10;

// Configuração do multer para a rota correta
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        fs.mkdirSync(uploadPath, { recursive: true }); // Garante que o diretório exista
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = {
    cadastroAdmin: async (req, res) => {
        const { email, senha, confirmarSenha } = req.body;

        if (!email || !senha || !confirmarSenha) {
            return res.render('pages/admin/administradores/criar', {
                error: 'Todos os campos são obrigatórios.'
            });
        }

        if (senha !== confirmarSenha) {
            return res.render('pages/admin/administradores/criar', {
                error: 'As senhas não coincidem. Tente novamente.'
            });
        }

        try {
            const emailExists = await Usuario.findOne({ where: { A01_EMAIL: email } });
            if (emailExists) {
                return res.render('pages/admin/administradores/criar', {
                    error: 'Email já cadastrado. Tente novamente.'
                });
            }

            const transaction = await sequelize.transaction();

            try {
                const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

                const usuario = await Usuario.create({
                    A01_EMAIL: email,
                    A01_SENHA: hashedPassword,
                    A01_PERFIL: 1,
                    A01_STATUS: 'ATIVO'

                }, { transaction });

                await transaction.commit();

                req.session.userId = usuario.A01_ID;
                res.redirect('/administradores/criar/concluido');
            } catch (error) {
                await transaction.rollback();
                console.error('Erro ao gravar os dados:', error);
                res.render('pages/admin/administradores/criar', {
                    error: 'Erro ao cadastrar. Tente novamente mais tarde.'
                });
            }
        } catch (error) {
            console.error('Erro ao verificar o cadastro:', error);
            res.render('pages/admin/administradores/criar', {
                error: 'Erro ao cadastrar. Tente novamente mais tarde.'
            });
        }
    },

    deleteAdmin: async (req, res) => {
        const { userId } = req.body;

        try {
            // Busca o administrador pelo ID
            const admin = await Usuario.findOne({ where: { A01_ID: userId } });
            if (!admin) {
                return res.status(404).send('Administrador não encontrado');
            }

            const transport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Envia o e-mail para o administrador
            await transport.sendMail({
                from: 'Peregrine <peregrine.planoviagem@gmail.com>',
                to: admin.A01_EMAIL,
                subject: 'Você foi removido como administrador',
                html: `<h1>Banimento de conta</h1>
                        <p>Sua conta foi removida do sistema de administradores.</p>`,
                text: 'Sua conta foi removida do sistema de administradores.',
            });

            // mudando status da conta
            await Usuario.update(
                { A01_STATUS: 'INATIVO' },
                { where: { A01_ID: userId } }
            );

            if (result > 0) {
                res.status(200).send('Administrador deletado com sucesso.');
            } else {
                res.status(404).send('Administrador não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao deletar administrador:', error);
            res.status(500).send('Erro no servidor ao deletar administrador.');
        }
    },

    deleteViajante: async (req, res) => {
        const { userId } = req.body;

        try {
            // Buscar o viajante e incluir os dados do usuário associado
            const viajante = await Viajante.findOne({
                where: { A02_ID: userId },
                include: { model: Usuario, attributes: ['A01_EMAIL'] }, // Inclui apenas o campo de e-mail
            });

            if (!viajante) {
                return res.status(404).send('Viajante não encontrado');
            }

            const emailUsuario = viajante.Usuario.A01_EMAIL; // E-mail do usuário associado
            const usuarioId = viajante.A01_ID; // ID do usuário associado

            // Configurar o transporte do e-mail
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // Altere para o serviço de e-mail que está usando
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Configurar os detalhes do e-mail
            const mailOptions = {
                from: '"Equipe de Administração" <' + process.env.EMAIL_USER + '>',
                to: emailUsuario,
                subject: 'Aviso de Exclusão de Conta',
                text: `Olá, Estamos entrando em contato para informar que sua conta será excluída de nossa plataforma. Caso tenha dúvidas, entre em contato com nosso suporte.Atenciosamente,Equipe de Administração`,
            };

            // Enviar o e-mail
            await transporter.sendMail(mailOptions);

            // mudando status da conta para BANIDO
            await Usuario.update(
                { A01_STATUS: 'BANIDO' },
                { where: { A01_ID: usuarioId } }
            );

            // Redirecionar ou retornar sucesso
            res.redirect('/viajantes/gerenciar/banir');
        } catch (error) {
            console.error('Erro ao enviar e-mail ou excluir viajante:', error);
            res.status(500).send('Erro no servidor');
        }
    },

    aprovandoViajantes: async (req, res) => {
        const uploadPath = path.join(__dirname, '../../uploads/viajantesAprovados');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, uploadPath),
            filename: (req, file, cb) => {
                const now = new Date();
                // Formata a data para o formato DD/MM/YYYY
                const date = now.toLocaleDateString('pt-BR').replace(/\//g, '-'); // Substitui barras por hífen
                // Formata a hora para o formato HH-MM
                const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Substitui ':' por '-'
                // Cria o nome do arquivo
                cb(null, `${date}-${time}-${file.originalname}`);
            }
        });

        const upload = multer({
            storage,
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'text/plain') {
                    cb(null, true);
                } else {
                    cb(new Error('Apenas arquivos .txt são permitidos.'), false);
                }
            },
            limits: { fileSize: 50 * 1024 * 1024 } // 50MB
        }).single('arquivo');

        upload(req, res, async (err) => {
            if (err) {
                return res.render('pages/admin/viajantes/aprovar/index', { error: err.message });
            }

            if (!req.file) {
                return res.render('pages/admin/viajantes/aprovar/index', { error: 'Nenhum arquivo foi anexado.' });
            }

            const filePath = path.join(uploadPath, req.file.filename);

            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const cpfs = data.split('\n').map(cpf => cpf.trim()).filter(cpf => cpf);

                const transaction = await sequelize.transaction();

                try {
                    for (const cpf of cpfs) {
                        const viajante = await Viajante.findOne({ where: { A02_CPF: cpf }, transaction });

                        if (viajante) {
                            await viajante.update({ A02_APROVADA: 1 }, { transaction });
                        }
                    }

                    await transaction.commit();

                    res.render('pages/admin/viajantes/aprovar/aprovar-concluido', {
                        success: 'Arquivo processado com sucesso!'
                    });
                } catch (error) {
                    await transaction.rollback();
                    console.error('Erro ao atualizar os registros:', error);
                    res.status(500).send('Erro ao processar o arquivo. Tente novamente mais tarde.');
                }
            } catch (error) {
                console.error('Erro ao processar o arquivo:', error);
                res.status(500).send('Erro ao processar o arquivo.');
            }
        });
    },

    aceitarDenuncia: async (req, res) => {
        const { userId, denunciaId } = req.body; // Recebe o ID do usuário e da denúncia
        try {
            const viajante = await Viajante.findOne({
                where: { A02_ID: userId },
                include: { model: Usuario, attributes: ['A01_EMAIL'] },
            });
    
            if (!viajante) {
                return res.status(404).send('Viajante não encontrado');
            }
    
            const emailUsuario = viajante.Usuario.A01_EMAIL;
            const usuarioId = viajante.A01_ID;
    
            // Envia o e-mail de notificação
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
    
            const mailOptions = {
                from: `"Equipe de Administração" <${process.env.EMAIL_USER}>`,
                to: emailUsuario,
                subject: 'Aviso de Exclusão de Conta',
                text: `Olá,\n\nEstamos entrando em contato para informar que sua conta será excluída de nossa plataforma. Caso tenha dúvidas, entre em contato com nosso suporte.\n\nAtenciosamente,\nEquipe de Administração`,
            };
    
            await transporter.sendMail(mailOptions);
    
            // Atualiza o status do usuário para BANIDO
            await Usuario.update(
                { A01_STATUS: 'BANIDO' },
                { where: { A01_ID: usuarioId } }
            );
    
            // Atualiza o status da denúncia
            await Denuncia.update(
                { A05_STATUS: 'RESOLVIDA' },
                { where: { A05_ID: denunciaId } }
            );
    
            res.redirect('/denuncias/individual/banir');
        } catch (error) {
            console.error('Erro ao enviar e-mail ou processar banimento:', error);
            res.status(500).send('Erro no servidor');
        }
    },
    cancelarDenuncia: async (req, res) => {
        const { userId, denunciaId } = req.body; // Recebe o ID do usuário e da denúncia
        try {
            const viajante = await Viajante.findOne({
                where: { A02_ID: userId },
                include: { model: Usuario, attributes: ['A01_EMAIL'] },
            });
    
            if (!viajante) {
                return res.status(404).send('Viajante não encontrado');
            }
    
            const emailUsuario = viajante.Usuario.A01_EMAIL;
                
            // Envia o e-mail de notificação
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
    
            const mailOptions = {
                from: `"Equipe de Administração" <${process.env.EMAIL_USER}>`,
                to: emailUsuario,
                subject: 'Aviso de Exclusão de Conta',
                text: `Olá,\n\nEstamos entrando em contato para informar que sua conta será excluída de nossa plataforma. Caso tenha dúvidas, entre em contato com nosso suporte.\n\nAtenciosamente,\nEquipe de Administração`,
            };
    
            await transporter.sendMail(mailOptions);
    
            // Atualiza o status da denúncia
            await Denuncia.update(
                { A05_STATUS: 'DESCARTADA' },
                { where: { A05_ID: denunciaId } }
            );
    
            res.redirect('/denuncias/individual/banir');
        } catch (error) {
            console.error('Erro ao enviar e-mail ou processar banimento:', error);
            res.status(500).send('Erro no servidor');
        }
    },   
};