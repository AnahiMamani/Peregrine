module.exports = {
    renderPerfil: (req, res) => {
        res.render('pages/viajante/perfil', {
            title: 'Perfil',
            user: req.session.user
        });
    }
}