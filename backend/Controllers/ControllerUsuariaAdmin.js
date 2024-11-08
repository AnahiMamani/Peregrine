module.exports = {
    renderAdmin: (req, res) => {
        res.render('pages/adminPage', {
            title: 'Administrador - Página Inicial',
            user: req.session.user // Inclui os dados do usuário na página
        });
    }
}
