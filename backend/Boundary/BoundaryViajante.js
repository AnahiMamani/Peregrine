module.exports = {
    renderPerfil: (req, res) => {
        res.render('pages/viajante/perfil', {
            title: 'Perfil',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    }
}