const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// Rota para renderizar o Index
router.get("/", indexController.renderIndex);

// Rota para renderizar a página de login
router.get("/login", indexController.renderLogin);

module.exports = router;