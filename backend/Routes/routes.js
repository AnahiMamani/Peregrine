const express = require("express");
const router = express.Router();
const Controller = require("../Controllers/control");

// Rota para renderizar o Index
router.get("/", Controller.renderIndex);

// Rota para renderizar o perfil
router.get("/perfil", Controller.renderPerfil);

// Rota para renderizar a Página Inicial do Admin
router.get("/administrador", Controller.renderAdmin);

// Rota para renderizar a página de login
router.get("/login", Controller.renderLogin);

            // Rota para renderizar a página de cadastro
            router.get("/cadastro", Controller.renderCadastro);

            // Rota para renderizar a página de cadastro
            router.get("/CadastroEnvioDocs", Controller.renderCadastroEnvioDocs);

            // Rota para a página de sucesso do cadastro
            router.get('/cadastroEnvioConcluido', Controller.renderCadastroEnvioConcluido);
            
// Rota para renderizar a página de  recuperar senha
router.get("/senhaRecuperar", Controller.renderSenhaRecuperar);

// Rota para renderizar a página de Redefinir Senha
router.get("/senhaCriarNova", Controller.renderSenhaCriarNova);

// Rota para renderizar a página de Redefinir Senha
router.get("/senhaCodigoRecuperacao", Controller.renderSenhaCodigoRecuperacao);

// Rota para renderizar a página de Redefinir Senha
router.get("/senhaAlteradaSucesso", Controller.renderSenhaAlteradaSucesso);



                // Rota para primeira etapa
                router.post('/cadastrarUsuarioEtapa1', Controller.cadastrarUsuarioEtapa1);

                // Rota para upload de documentos (segunda tela)
                router.post('/uploadDocumentos', Controller.uploadDocumentos);

// Metodo do Controler para retornar uma resposta para o cliente
router.post("/verificandoLogin", Controller.login);

// Rota para atualizar a senha no banco de dados
router.post("/atualizarSenha", Controller.atualizarSenha);

// Metodo do Controler para retornar uma resposta para o cliente
router.post("/funRecuperarSenha", Controller.funRecuperarSenha);

// Rota para validar o código
router.post("/validaCodigo", Controller.validaCodigo);

// Rota para fazer logout, pq nao é post? pois é "tipico" que se deixe o logout com o get
router.get('/logout', Controller.logout);

module.exports = router;