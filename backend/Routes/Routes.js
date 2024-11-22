//MENSAGEM SECRETA PARA NATALIA

const express = require('express');
const router = express.Router();
const BoundaryAdmin = require('../Boundary/BoundaryAdmin');
const BoundaryViajante = require('../Boundary/BoundaryViajante');
const BoundaryUsuario = require('../Boundary/BoundaryUsuario');

// Nota: Controles/Boundary -> Routes -> Server.js

// Página inicial
router.get('/', BoundaryUsuario.renderIndex);
router.get('/sobre', BoundaryUsuario.renderSobre);
router.get('/faq', BoundaryUsuario.renderAjudaFAQ);
router.get('/suporte-email', BoundaryUsuario.renderAjudaEmail);

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
router.get('/viajantes/gerenciar/banir', BoundaryAdmin.banirViajante);

// Perfil do viajante
router.get('/perfil', BoundaryViajante.renderPerfil);
router.get('/perfil/minhas-viagens', BoundaryViajante.renderMinhasViagens);
router.get('/perfil/alterar-email', BoundaryViajante.renderUsuarioAlterarEmail);
router.get('/perfil/alterar-senha', BoundaryViajante.renderUsuarioAlterarSenha);
router.get('/perfil/editar-perfil', BoundaryViajante.renderUsuarioEditar);
router.get('/perfil/excluir-perfil', BoundaryViajante.renderUsuarioExcluir);

// Viagem
router.get('/viagem', BoundaryViajante.renderPesquisaViagem);
router.get('/viagem/resultados', BoundaryViajante.renderPesquisaViagemResultados);
router.get('/viagem/detalhes/:id', BoundaryViajante.renderViagemDetalhes);
router.get('/viagem/inscricao', BoundaryViajante.renderInscricaoConcluida);
router.get('/viagem/planejamento', BoundaryViajante.renderPlanejarViagem);
router.get('/viagem/criada', BoundaryViajante.renderPlanejamentoConcluido);
router.get('/viagem/alteracao', BoundaryViajante.renderAlterarViagem);

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
