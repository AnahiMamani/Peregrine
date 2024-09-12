const express = require("express");
const router = express.Router();
const Controller = require("../Controllers/control");

// Rota para renderizar o Index
router.get("/", Controller.renderIndex);

// Rota para renderizar a página de login
router.get("/login", Controller.renderLogin);

// Rota para renderizar a página de cadastro
router.get("/cadastro", Controller.renderCadastro);

// Rota para renderizar a página de  recuperar senha
router.get("/recuperarSenha", Controller.renderRecuperarSenha);

// Metodo do Controler para retornar uma resposta para o cliente
router.post("/cadastrarUsuario", Controller.cadastrarUsuario);

// Metodo do Controler para retornar uma resposta para o cliente
router.post("/verificandoLogin", Controller.login);

// Rota para a página de sucesso do cadastro
router.get('/cadastro-sucesso', Controller.renderCadastroSucesso);

module.exports = router;