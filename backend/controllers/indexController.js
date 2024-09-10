module.exports = {
    renderIndex: (req, res) => {
        res.render("pages/indexPage");
    },
    renderLogin: (req, res) => {
        res.render("pages/loginPage");
    }
}