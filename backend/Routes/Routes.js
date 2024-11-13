const express = require('express');
const router = express.Router();
const BoundaryAdmin = require('../Boundary/BoundaryAdmin');
const BoundaryViajante = require('../Boundary/BoundaryViajante');
const BoundaryUsuario = require('../Boundary/BoundaryUsuario');

//Nota: Controles/Boundary -> Routes -> Server.js

router.get('/', BoundaryUsuario.renderIndex);

// Rotas da página inicial do administrador
router.get('/index-admin', BoundaryAdmin.renderIndexAdmin);

// Rotas de relatórios
router.get('/relatorio', BoundaryAdmin.renderRelatorio);
router.get('/relatorio/concluir-relatorio', BoundaryAdmin.renderRelatorioConcluido);


// Rotas de viajantes
router.get('/viajantes', BoundaryAdmin.renderViajantes);
router.get('/viajantes/listar', BoundaryAdmin.listarViajantes);

router.get('/viajantes/aprovar', BoundaryAdmin.aprovarViajantes);
router.get('/viajantes/concluir-aprovacao', BoundaryAdmin.concluirAprovacao);

// Rotas de denúncias de viajantes
router.get('/denuncias', BoundaryAdmin.renderDenuncias);
router.get('/denuncias/individual', BoundaryAdmin.denunciaIndividual);
router.get('/denuncias/individual/cancelar', BoundaryAdmin.cancelarDenuncia);
router.get('/denuncias/individual/banir', BoundaryAdmin.banirDenuncia);

// Rotas de administradores
router.get('/administradores', BoundaryAdmin.renderAdminUsuarios);
router.get('/administradores/criar', BoundaryAdmin.criarAdmin);
router.get('/administradores/criar-concluido', BoundaryAdmin.criarAdminConcluido);

// Rota para renderizar o perfil
router.get('/perfil', BoundaryViajante.renderPerfil);

// Rota para renderizar a página de login
router.get('/login', BoundaryUsuario.renderLogin);

// Rota para renderizar a página de cadastro
router.get('/cadastro', BoundaryUsuario.renderCadastro);
router.get('/cadastro/termos-condicoes', BoundaryUsuario.renderCadastroTermos);
router.get('/cadastro/documentacao', BoundaryUsuario.renderCadastroEnvioDocs);
router.get('/cadastro/documentacao/concluido', BoundaryUsuario.renderCadastroEnvioConcluido);

// Rota para renderizar a página de recuperar senha
router.get('/recuperar-senha', BoundaryUsuario.renderSenhaRecuperar);
router.get('/recuperar-senha/codigo', BoundaryUsuario.renderSenhaCodigoRecuperacao);
router.get('/recuperar-senha/codigo/criar', BoundaryUsuario.renderSenhaCriarNova);
router.get('/recuperar-senha/codigo/criar/concluido', BoundaryUsuario.renderSenhaAlteradaSucesso);

module.exports = router;
