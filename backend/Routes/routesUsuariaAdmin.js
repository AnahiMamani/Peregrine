const express = require("express");
const router = express.Router();
const Usuario = require('../models/Usuario_01'); // Importando o modelo de Usuario

const Controller = require("../Controllers/ControllerUsuariaAdmin");

// Rotas da página inicial do administrador
router.get("/indexAdmin", Controller.renderIndexAdmin);

// Rotas de relatórios
router.get("/relatorio", Controller.renderRelatorio);

// Rotas de viajantes
router.get("/viajantes", Controller.renderViajantes);
router.get("/viajantes/listar", Controller.listarViajantes);
router.get("/viajantes/aprovar", Controller.aprovarViajantes);
router.get("/viajantes/concluir-aprovacao", Controller.concluirAprovacao);

// Rotas de denúncias de viajantes
router.get("/denuncias", Controller.renderDenuncias);
router.get("/denuncias/individual", Controller.denunciaIndividual);
router.get("/denuncias/individual/cancelar", Controller.cancelarDenuncia);
router.get("/denuncias/individual/banir", Controller.banirDenuncia);

// Rotas de administradores
router.get("/administradores", Controller.renderAdminUsuarios);
router.get("/administradores/criar", Controller.criarAdmin);
router.get("/administradores/criar/concluido", Controller.criarAdminConcluido);

router.post("/cadastrarAdmin", Controller.adminCadastro);

module.exports = router;
