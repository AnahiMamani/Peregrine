const cadastro = require("../models/dados")

module.exports = {
    renderIndex: (req, res) => {
        res.render("pages/indexPage");
    },

    renderLogin: (req, res) => {
        res.render("pages/loginPage");
    },

    renderCadastro: (req, res) => {
        res.render("pages/cadastroPage");
    },

    cadastrarUsuario:(req,res)=> {
        cadastro.create({
            nome: req.body.nome,
            email: req.body.email,
            celular: req.body.celular,
            senha: req.body.senha,
            confirmarSenha: req.body.confirmarSenha
        })
        .then(() => {
            console.log("Dados cadastrados com sucesso!")
            res.send("Dados cadastrados com sucesso!")
        })
        .catch((error) => {
            console.log("Erro ao gravar os dados na entidade")
            res.send("Erro ao gravar dados");
        });
    },
}