const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_01'); // Ajuste o caminho conforme necessário
const saltRounds = 10;
const sequelize = require('../config/bd');

module.exports = {
    renderIndexAdmin: (req, res) => {
        res.render('pages/Admin/A_IndexPage', {
            title: 'Administrador - Página Inicial',
            user: req.session.user
        });
    },

    renderRelatorio: (req, res) => {
        res.render('pages/Admin/A1_Relatorio', {
            title: 'Relatórios',
            user: req.session.user
        });
    },

    renderViajantes: (req, res) => {
        res.render('pages/Admin/A2_Viajantes', {
            title: 'Usuários - Viajantes',
            user: req.session.user
        });
    },

    listarViajantes: (req, res) => {
        res.render('pages/Admin/A2_1_Listar', {
            title: 'Usuários - Viajantes',
            user: req.session.user
        });
    },

    aprovarViajantes: (req, res) => {
        res.render('pages/Admin/A2_2_Aprovar', {
            title: 'Usuários - Viajantes',
            user: req.session.user
        });
    },

    concluirAprovacao: (req, res) => {
        res.render('pages/Admin/A2_2_1_Concluido', {
            title: 'Usuários - Viajantes',
            user: req.session.user
        });
    },

    renderDenuncias: (req, res) => {
        res.render('pages/Admin/A2_3_Denuncias', {
            title: 'Usuários - Viajantes',
            user: req.session.user
        });
    },

    denunciaIndividual: (req, res) => {
        res.render('pages/Admin/A2_3_1_DenunciaIndividual', {
            title: 'Administrador - Página Inicial',
            user: req.session.user
        });
    },

    cancelarDenuncia: (req, res) => {
        res.render('pages/Admin/A2_3_1_1_Cancelada', {
            title: 'Administrador - Página Inicial',
            user: req.session.user
        });
    },

    banirDenuncia: (req, res) => {
        res.render('pages/Admin/A2_3_1_2_Banida', {
            title: 'Administrador - Página Inicial',
            user: req.session.user
        });
    },

    renderAdminUsuarios: (req, res) => {
        res.render('pages/Admin/A3_Admin', {
            title: 'Usuários Administradores',
            user: req.session.user
        });
    },

    criarAdmin: (req, res) => {
        res.render('pages/Admin/A3_1_Criar', {
            title: 'Criar Administrador',
            user: req.session.user
        });
    },

    criarAdminConcluido: (req, res) => {
        res.render('pages/Admin/A3_1_1_CriarConcluido', {
            title: 'Criar Administrador',
            user: req.session.user
        });
    },

    adminCadastro: async (req, res) => {
        const { email, senha, confirmarSenha } = req.body;

        // Verificar se os campos obrigatórios estão preenchidos
        if (!email || !senha || !confirmarSenha) {
            return res.render('pages/Admin/A3_1_Criar', { error: 'Todos os campos são obrigatórios.' });
        }

        // Verificar se a senha e a confirmação de senha correspondem
        if (senha !== confirmarSenha) {
            return res.render('pages/Admin/A3_1_Criar', { error: 'As senhas não coincidem. Tente novamente.' });
        }

        try {
            // Verificar se o email ou CPF já estão cadastrados
            const emailExists = await Usuario.findOne({ where: { A01_EMAIL: email } });
            if (emailExists) {
                return res.render('pages/Admin/A3_1_Criar', { error: 'CPF ou Email já cadastrados. Tente novamente.' });
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
                    A01_PERFIL: 1
                }, { transaction });
                // Confirmando todas as operações na transação
                await transaction.commit();

                // Armazenar o ID do usuário na sessão e redirecionar
                req.session.userId = usuario.A01_ID;
                res.redirect('/administrador/administradores/criar/concluido');

            } catch (error) {
                // Reverter a transação em caso de erro
                await transaction.rollback();
                console.error("Erro ao gravar os dados:", error);
                res.render('pages/Admin/A3_1_Criar', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
            }

        } catch (error) {
            console.log("Erro ao verificar o cadastro:", error);
            res.render('pages/Admin/A3_1_Criar', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
        }
    },
};
