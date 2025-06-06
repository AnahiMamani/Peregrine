const express = require('express');
const router = express.Router();
const BoundaryAdmin = require('../Boundary/BoundaryAdmin');
const BoundaryViajante = require('../Boundary/BoundaryViajante');
const BoundaryUsuario = require('../Boundary/BoundaryUsuario');
const verificarUsuarioLogado = require('../Middleware/verificandoLogin')
// Nota: Controles/Boundary -> Routes -> Server.js
const { gerarRelatorioViagens } = require('../Controllers/relatorioController');

// Rota para gerar o relatório e fazer o download
router.get('/relatorio/gerar', async (req, res) => {
    try {
        // Gera o buffer do PDF
        const pdfBuffer = await gerarRelatorioViagens();

        // Configura os cabeçalhos para o download do arquivo
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');

        // Envia o buffer como resposta
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Erro ao gerar o relatório:', error);
        res.status(500).send('Erro ao gerar o relatório');
    }
});

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
router.get('/viajantes/denuncias/individual/:id', BoundaryAdmin.denunciaIndividual);
router.get('/denuncias/individual/cancelar', BoundaryAdmin.cancelarDenuncia);
router.get('/denuncias/individual/banir', BoundaryAdmin.banirDenuncia);

// Gerenciar viajantes
router.get('/viajantes/gerenciar', BoundaryAdmin.listarViajantes);
router.get('/viajantes/gerenciar/banir', BoundaryAdmin.banirViajante);

// Perfil do viajante
router.get('/perfil', BoundaryViajante.renderPerfil);
router.get('/perfil/minhas-viagens', BoundaryViajante.renderMinhasViagens);

router.get('/perfil/minhas-viagens-inscritas', BoundaryViajante.renderViagensInscritas);
router.get('/perfil/minhas-viagens/consulta-inscritas/:id', BoundaryViajante.renderConsultaViagensInscritas);
router.get('/perfil/minhas-viagens-criadas', BoundaryViajante.renderViagensCriadas);
router.get('/perfil/minhas-viagens-anuncio/:id', BoundaryViajante.renderAnuncio);
router.get('/perfil/minhas-viagens-concluidas', BoundaryViajante.renderViagensConcluidas);

router.get('/perfil/minhas-viagens-concluidas/:id', BoundaryViajante.renderSelecaoConcluidas);

router.get('/perfil/concluidas/avaliacao/:id', BoundaryViajante.renderAvaliacao);
router.get('/perfil/avaliacao/concluida', BoundaryViajante.renderAvaliacaoConcluida);

router.get('/perfil/concluidas/denuncia/:id', BoundaryViajante.renderDenuncia);
router.get('/perfil/denuncia/concluida', BoundaryViajante.renderDenunciaConcluida);

router.get('/perfil/alterar-email', BoundaryViajante.renderUsuarioAlterarEmail);
router.get('/perfil/alterar-senha', BoundaryViajante.renderUsuarioAlterarSenha);
router.get('/perfil/editar-perfil', BoundaryViajante.renderUsuarioEditar);
router.get('/perfil/excluir-perfil', BoundaryViajante.renderUsuarioExcluir);

// Viagem
// router.get('/viagem', BoundaryViajante.renderPesquisaViagem);
router.get('/viagem/resultados',verificarUsuarioLogado, BoundaryViajante.renderPesquisaViagemResultados);
router.get('/viagem/detalhes/:id',verificarUsuarioLogado, BoundaryViajante.renderViagemDetalhes);
router.get('/viagem/inscricao/:id',verificarUsuarioLogado, BoundaryViajante.renderInscricaoConcluida);
router.get('/viagem/planejamento',verificarUsuarioLogado, BoundaryViajante.renderPlanejarViagem);
router.get('/viagem/criada', verificarUsuarioLogado, BoundaryViajante.renderPlanejamentoConcluido);
router.get('/viagem/alteracao/:id',verificarUsuarioLogado, BoundaryViajante.renderAlterarViagem);
router.get('/viagem/exclusao-concluida',verificarUsuarioLogado, BoundaryViajante.renderExcluirViagemConcluido);
router.get('/viagem/alteracao-concluida',verificarUsuarioLogado, BoundaryViajante.renderAlterarViagemConcluido);

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
