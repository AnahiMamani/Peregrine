function verificarUsuarioLogado(req, res, next) {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.redirect('/login');
    }
    next();
}

module.exports = verificarUsuarioLogado;
