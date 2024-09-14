const express = require("express");
const router = express.Router();
const Controller = require("../Controllers/control");

// Rota para renderizar o Index
router.get("/", Controller.renderIndex);

// Rota para renderizar a Página Inicial do Admin
router.get("/administrador", Controller.renderAdmin);

// Rota para renderizar a página de login
router.get("/login", Controller.renderLogin);

// Rota para renderizar a página de cadastro
router.get("/cadastro", Controller.renderCadastro);

// Rota para renderizar a página de  recuperar senha
router.get("/recuperarSenha", Controller.renderRecuperarSenha);

// Rota para a página de sucesso do cadastro
router.get('/cadastro-sucesso', Controller.renderCadastroSucesso);

// Rota para renderizar a página de Redefinir Senha
router.get("/redefinirSenhaPage", Controller.renderRedefinirSenha);


// Metodo do Controler para retornar uma resposta para o cliente
router.post("/cadastrarUsuario", Controller.cadastrarUsuario);

// Metodo do Controler para retornar uma resposta para o cliente
router.post("/verificandoLogin", Controller.login);

// Rota para atualizar a senha no banco de dados
router.post("/atualizarSenha", Controller.atualizarSenha);

// Metodo do Controler para retornar uma resposta para o cliente
router.post("/funRecuperarSenha", Controller.funRecuperarSenha);

// Rota para validar o código
router.post("/validaCodigo", Controller.validaCodigo);

module.exports = router;