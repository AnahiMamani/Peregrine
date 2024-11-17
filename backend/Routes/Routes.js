const express = require('express');
const router = express.Router();
const BoundaryAdmin = require('../Boundary/BoundaryAdmin');
const BoundaryViajante = require('../Boundary/BoundaryViajante');
const BoundaryUsuario = require('../Boundary/BoundaryUsuario');

// Nota: Controles/Boundary -> Routes -> Server.js

// Página inicial
router.get('/', BoundaryUsuario.renderIndex);

// Rotas do administrador
router.get('/index-admin', BoundaryAdmin.renderIndexAdmin);

// Gerenciamento de administradores
router.get('/administradores', BoundaryAdmin.renderAdminUsuarios);
router.get('/administradores/criar', BoundaryAdmin.criarAdmin);
router.get('/administradores/criar/concluido', BoundaryAdmin.criarAdminConcluido);
router.get('/administradores/banir', BoundaryAdmin.banirAdmin);

// Relatórios
router.get('/relatorio', BoundaryAdmin.renderRelatorio);
router.get('/relatorio/concluido', BoundaryAdmin.renderRelatorioConcluido);

// Viajantes
router.get('/viajantes', BoundaryAdmin.renderViajantes);

// Aprovação de viajantes
router.get('/viajantes/aprovar', BoundaryAdmin.aprovarViajantes);
router.get('/viajantes/aprovar/concluido', BoundaryAdmin.concluirAprovacao);

// Denúncias de viajantes
router.get('/viajantes/denuncias', BoundaryAdmin.renderDenuncias);
router.get('/viajantes/denuncias/individual', BoundaryAdmin.denunciaIndividual);
router.get('/viajantes/denuncias/individual/cancelar', BoundaryAdmin.cancelarDenuncia);
router.get('/viajantes/denuncias/individual/banir', BoundaryAdmin.banirDenuncia);

// Gerenciar viajantes
router.get('/viajantes/gerenciar', BoundaryAdmin.listarViajantes);

// Perfil do viajante
router.get('/perfil', BoundaryViajante.renderPerfil);

// Cadastro de usuário
router.get('/cadastro', BoundaryUsuario.renderCadastro);
router.get('/cadastro/termos-condicoes', BoundaryUsuario.renderCadastroTermos);
router.get('/cadastro/documentacao', BoundaryUsuario.renderCadastroEnvioDocs);
router.get('/cadastro/documentacao/concluido', BoundaryUsuario.renderCadastroEnvioConcluido);

// Recuperação de senha
router.get('/recuperar-senha', BoundaryUsuario.renderSenhaRecuperar);
router.get('/recuperar-senha/codigo', BoundaryUsuario.renderSenhaCodigoRecuperacao);
router.get('/recuperar-senha/codigo/criar', BoundaryUsuario.renderSenhaCriarNova);
router.get('/recuperar-senha/codigo/criar/concluido', BoundaryUsuario.renderSenhaAlteradaSucesso);

// Login do usuário
router.get('/login', BoundaryUsuario.renderLogin);

module.exports = router;
