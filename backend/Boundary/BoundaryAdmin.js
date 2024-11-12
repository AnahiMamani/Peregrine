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
    }
}