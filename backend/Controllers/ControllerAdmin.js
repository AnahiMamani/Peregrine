const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_01'); // Ajuste o caminho conforme necessário
const SALT_ROUNDS = 10;
const sequelize = require('../config/bd');

module.exports = {
    cadastroAdmin: async (req, res) => {
        const { email, senha, confirmarSenha } = req.body;

        // Verificar se os campos obrigatórios estão preenchidos
        if (!email || !senha || !confirmarSenha) {
            return res.render('pages/admin/administradores/criar', { error: 'Todos os campos são obrigatórios.' });
        }

        // Verificar se a senha e a confirmação de senha correspondem
        if (senha !== confirmarSenha) {
            return res.render('pages/admin/administradores/criar', { error: 'As senhas não coincidem. Tente novamente.' });
        }

        try {
            // Verificar se o email ou CPF já estão cadastrados
            const emailExists = await Usuario.findOne({ where: { A01_EMAIL: email } });
            if (emailExists) {
                return res.render('pages/admin/administradores/criar', { error: 'Email já cadastrados. Tente novamente.' });
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
                    A01_PERFIL: 1
                }, { transaction });
                // Confirmando todas as operações na transação
                await transaction.commit();

                // Armazenar o ID do usuário na sessão e redirecionar
                req.session.userId = usuario.A01_ID;
                res.redirect('/administradores/criar/concluido');

            } catch (error) {
                // Reverter a transação em caso de erro
                await transaction.rollback();
                console.error("Erro ao gravar os dados:", error);
                res.render('pages/admin/administradores/criar', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
            }

        } catch (error) {
            console.log("Erro ao verificar o cadastro:", error);
            res.render('pages/admin/administradores/criar', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
        }
    },
    delete: async (req, res) => {
        const { userId } = req.body; // Agora você recebe o ID do corpo da requisição
        try {
            // Tenta deletar o usuário
            const result = await Usuario.destroy({
                where: { A01_ID: userId }
            });
    
            // Verifica se a deleção foi bem-sucedida
            if (result > 0) {
                // Usuário deletado com sucesso, agora redireciona para a página de banir
                res.redirect('/administradores/banir');
            } else {
                // Caso o usuário não seja encontrado
                res.status(404).send('Usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao deletar dado:', error);
            res.status(500).send('Erro no servidor');
        }
    }
    
};