module.exports = {
    renderIndexAdmin: (req, res) => {
        res.render('pages/Admin/A_IndexPage', {
            title: 'Administrador - Página Inicial',
            user: req.session.user // Inclui os dados do usuário na página
        });
    },
            A1_renderRelatorio: (req, res) => {
                res.render('pages/Admin/A1_Relatorio', {
                    title: 'Relatórios',
                    user: req.session.user // Inclui os dados do usuário na página
                });
            },
            A2_renderViajantes: (req, res) => {
                res.render('pages/Admin/A2_Viajantes', {
                    title: 'Usuarios - Viajantes',
                    user: req.session.user // Inclui os dados do usuário na página
                });
            },
                            A2_renderListarViajantes: (req, res) => {
                                res.render('pages/Admin/A2.1_Listar', {
                                    title: 'Usuarios - Viajantes',
                                    user: req.session.user // Inclui os dados do usuário na página
                                });
                            },
                            A2_renderAprovarViajantes: (req, res) => {
                                res.render('pages/Admin/A2.2_Aprovar', {
                                    title: 'Usuarios - Viajantes',
                                    user: req.session.user // Inclui os dados do usuário na página
                                });
                            },
                                            A2_renderConcluir: (req, res) => {
                                                res.render('pages/Admin/A2.2.1_Concluido', {
                                                    title: 'Usuarios - Viajantes',
                                                    user: req.session.user // Inclui os dados do usuário na página
                                                });
                                            },
                            A2_renderDenuncias: (req, res) => {
                                res.render('pages/Admin/A2.3_Denuncias', {
                                    title: 'Usuarios - Viajantes',
                                    user: req.session.user // Inclui os dados do usuário na página
                                });
                            },
                                            A2_renderDenunciaIndividual: (req, res) => {
                                                res.render('pages/Admin/A2.3.1_DenunciaIndividual', {
                                                    title: 'Administrador - Página Inicial',
                                                    user: req.session.user // Inclui os dados do usuário na página
                                                });
                                            },
                                                            A2_renderCancelarDenuncia: (req, res) => {
                                                                res.render('pages/Admin/A2.3.1.1_Cancelada', {
                                                                    title: 'Administrador - Página Inicial',
                                                                    user: req.session.user // Inclui os dados do usuário na página
                                                                });
                                                            },
                                                            A2_renderBanirDenuncia: (req, res) => {
                                                                res.render('pages/Admin/A2.3.1.2_Banida', {
                                                                    title: 'Administrador - Página Inicial',
                                                                    user: req.session.user // Inclui os dados do usuário na página
                                                                });
                                                            },
            A3_renderAdmin: (req, res) => {
                res.render('pages/Admin/A3_Admin', {
                    title: 'Usuarios Administradores',
                    user: req.session.user // Inclui os dados do usuário na página
                });
            },
                            A3_renderCriar: (req, res) => {
                                res.render('pages/Admin/A3.1_Criar', {
                                    title: 'Criar Administrador',
                                    user: req.session.user // Inclui os dados do usuário na página
                                });
                            },
                                            A3_renderCriarConcluido: (req, res) => {
                                                res.render('pages/Admin/A3.1.1_CriarConcluido', {
                                                    title: 'Criar Administrador',
                                                    user: req.session.user // Inclui os dados do usuário na página
                                                });
                                            }
}
