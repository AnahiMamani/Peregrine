const express = require("express");
const router = express.Router();
const ControllerViajante = require("../Controllers/ControllerViajante");
const ControllerUsuario = require("../Controllers/ControllerUsuario");
const ControllerAdmin = require("../Controllers/ControllerAdmin");
const ControllerViagem = require("../Controllers/ControllerViagem");
const { criarOuAtualizarAvaliacao } = require('../Controllers/ControllerAvaliacao');
const Viagem = require('../models/Viagem_03')

//Contorller Administrador
router.post("/CadastrarAdmin", ControllerAdmin.cadastroAdmin);
router.post('/deleteAdmin/:id', ControllerAdmin.deleteAdmin);
router.post('/AprovandoViajantes', ControllerAdmin.aprovandoViajantes);
router.post('/aceitarDenuncia/:id', ControllerAdmin.aceitarDenuncia);
router.post('/cancelarDenuncia/:id', ControllerAdmin.cancelarDenuncia);
router.post('/deleteViajante/:id', ControllerAdmin.deleteViajante);

//Contorller Viajante
router.post('/CadastroViajante', ControllerViajante.cadastroViajante);
router.post('/UploadDocumentos', ControllerViajante.uploadDocumentos);
router.post('/editarPerfil', ControllerViajante.editarPerfil);
router.post('/AtualizarSenhaPerfil', ControllerViajante.atualizarSenhaPerfil);
router.post('/AtualizarEmailPerfil', ControllerViajante.atualizarEmail);
router.post('/deletarViajante', ControllerViajante.deleteViajante);
router.post('/avaliar-organizadora', criarOuAtualizarAvaliacao);
router.post('/viagem-update/:id', ControllerViajante.alterarViagem);
router.post('/viagem-delete/:id', ControllerViajante.deleteViagem);
router.post('/denuncia/:id', ControllerViagem.denuncia);

router.put('/viagem/alterar-status/:id', async (req, res) => {
    const viagemId = req.params.id;
    const { status } = req.body;

    try {
        // Atualiza o status da viagem
        const [updated] = await Viagem.update(
            { A03_STATUS: status },
            { where: { A03_ID: viagemId } }
        );

        if (updated) {
            res.status(200).send('Status da viagem atualizado com sucesso');
        } else {
            res.status(404).send('Viagem não encontrada');
        }
    } catch (error) {
        console.error('Erro ao atualizar status da viagem:', error);
        res.status(500).send('Erro no servidor');
    }
});


//Controller Viagem
router.post('/cadastroViagem', ControllerViagem.cadastrarViagem);
router.post('/adicionar/:id', ControllerViagem.adicionarViagem);

//Contorller Usuario
router.get("/Logout", ControllerUsuario.logout);
router.post("/Login", ControllerUsuario.login);
router.post("/AtualizarSenha", ControllerUsuario.atualizarSenha);
router.post("/ValidarEmail", ControllerUsuario.validarEmail);
router.post("/ValidaCodigo", ControllerUsuario.validaCodigo);

module.exports = router;
