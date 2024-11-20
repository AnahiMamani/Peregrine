module.exports = {
    renderSobre: (req, res) => {
        res.render('pages/sobre', {
            title: 'Sobre',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderIndex: (req, res) => {
        res.render('pages/index', {
            title: 'Peregrine',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    renderLogin: (req, res) => {
        res.render("pages/login", {
            title: 'Login',
            logoPath: '/images/logo.ico'
        });
    },

    renderCadastro: (req, res) => {
        res.render("pages/cadastro/index", {
            title: 'Cadastro',
            logoPath: '/images/logo.ico'
        });
    },

    renderCadastroEnvioDocs: (req, res) => {
        res.render("pages/cadastro/documentos", {
            title: 'Cadastro',
            logoPath: '/images/logo.ico'
        });
    },

    renderCadastroEnvioConcluido: (req, res) => {
        res.render("pages/cadastro/cadastro-concluido", {
            title: 'Cadastro',
            logoPath: '/images/logo.ico'
        });
    },

    renderCadastroTermos: (req, res) => {
        res.render("pages/cadastro/termos", {
            title: 'Termos e Condições',
            logoPath: '/images/logo.ico'
        });
    },

    renderSenhaAlteradaSucesso: (req, res) => {
        res.render("pages/recuperar-senha/alterar-concluido", {
            title: 'Senha Alterada',
            logoPath: '/images/logo.ico'
        });
    },

    renderSenhaCodigoRecuperacao: (req, res) => {
        res.render("pages/recuperar-senha/codigo", {
            title: 'Codigo de Recuperação',
            logoPath: '/images/logo.ico'
        });
    },

    renderSenhaCriarNova: (req, res) => {
        res.render("pages/recuperar-senha/criar", {
            title: 'Criando nova Senha',
            logoPath: '/images/logo.ico'
        });
    },

    renderSenhaRecuperar: (req, res) => {
        res.render("pages/recuperar-senha/index", {
            title: 'Esqueci minha senha',
            logoPath: '/images/logo.ico'
        });
    },

    renderAjudaFAQ: (req, res) => {
        res.render("pages/ajuda/ajudaFAQ", {
            title: 'FAQ - Dúvidas frequentes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    renderAjudaEmail: (req, res) => {
        res.render("pages/ajuda/ajudaSuporteEmail", {
            title: 'Suporte - Email',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    }
}