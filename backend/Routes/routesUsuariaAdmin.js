const express = require("express");
const router = express.Router();
const Controller = require("../Controllers/ControllerUsuariaAdmin");


// Rota para renderizar o perfil
router.get("/administrador", Controller.renderAdmin);

module.exports = router;