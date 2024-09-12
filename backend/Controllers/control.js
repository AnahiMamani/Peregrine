const bcrypt = require('bcrypt');
const cadastro = require("../models/dados")
const saltRounds = 10; // Define o número de salt rounds para o hash da senha

module.exports = {
    renderIndex: (req, res) => {
        res.render("pages/indexPage");
    },

    renderRecuperarSenha: (req, res) => {
        res.render("pages/recuperarSenhaPage");
    },

    renderLogin: (req, res) => {
        res.render("pages/loginPage");
    },

    renderCadastro: (req, res) => {
        res.render("pages/cadastroPage");
    },

    renderCadastroSucesso: (req, res) => {
        res.render("pages/cadastroSucessoPage");
    },

    cadastrarUsuario: (req, res) => {
        const { nome, email, celular, senha } = req.body;

        // Gera o hash da senha antes de salvar no banco de dados
        bcrypt.hash(senha, saltRounds)
            .then((hashedPassword) => {
                // Cria o usuário no banco de dados com a senha hash
                return cadastro.create({
                    nome,
                    email,
                    celular,
                    senha: hashedPassword // Salva a senha como hash
                });
            })
            .then(() => {
                console.log("Dados cadastrados com sucesso!");
                res.redirect('/cadastro-sucesso'); // Redireciona para a página de sucesso
            })
            .catch((error) => {
                console.log("Erro ao gravar os dados na entidade:", error);
                res.render('pages/cadastroPage', { error: 'Erro ao cadastrar. Tente novamente.' }); // Exibe a mensagem de erro na página
            });
    },

    login: async (req, res) => {
        const { email, senha } = req.body;

        try {
            const user = await cadastro.findOne({ where: { email } });
            if (user && await bcrypt.compare(senha, user.senha)) {
                // Login bem-sucedido
                res.redirect('/');
            } else {
                // Credenciais inválidas
                res.render('pages/loginPage', { error: 'Email ou senha incorretos!' });
            }
        } catch (error) {
            console.error('Erro ao realizar o login:', error);
            res.render('pages/loginPage', { error: 'Erro ao realizar o login. Tente novamente.' });
        }
    }
}