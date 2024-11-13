module.exports = {
    renderIndex: (req, res) => {
        res.render('pages/index', {
            title: 'Página Inicial',
            user: req.session.user
        });
    },

    renderLogin: (req, res) => {
        res.render("pages/login", {
            title: 'Login'
        });
    },

    renderCadastro: (req, res) => {
        res.render("pages/cadastro/index", {
            title: 'Cadastro'
        });
    },

    renderCadastroEnvioDocs: (req, res) => {
        res.render("pages/cadastro/documentos", {
            title: 'Cadastro'
        });
    },

    renderCadastroEnvioConcluido: (req, res) => {
        res.render("pages/cadastro/cadastro-concluido", {
            title: 'Cadastro'
        });
    },

    renderCadastroTermos: (req, res) => {
        res.render("pages/cadastro/termos", {
            title: 'Termos e Condições'
        });
    },

    renderSenhaAlteradaSucesso: (req, res) => {
        res.render("pages/recuperar-senha/alterar-concluido", {
            title: 'Senha Alterada'
        });
    },

    renderSenhaCodigoRecuperacao: (req, res) => {
        res.render("pages/recuperar-senha/codigo", {
            title: 'Codigo de Recuperação'
        });
    },

    renderSenhaCriarNova: (req, res) => {
        res.render("pages/recuperar-senha/criar", {
            title: 'Criando nova Senha'
        });
    },

    renderSenhaRecuperar: (req, res) => {
        res.render("pages/recuperar-senha/index", {
            title: 'Esqueci minha senha'
        });
    }
}