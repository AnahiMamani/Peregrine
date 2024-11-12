module.exports = {
    renderIndex: (req, res) => {
        res.render('pages/telaInicial', {
            title: 'Página Inicial',
            user: req.session.user
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
    }
}