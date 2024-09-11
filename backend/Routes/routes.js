const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

// Rota para renderizar o Index
router.get("/", Controller.renderIndex);

// Rota para renderizar a página de login
router.get("/login", Controller.renderLogin);

// Rota para renderizar a página de cadastro
router.get("/cadastro", Controller.renderCadastro);

// Metodo do Controler para retornar uma resposta para o cliente
router.post("/cadastro", Controller.cadastrarUsuario);

module.exports = router;