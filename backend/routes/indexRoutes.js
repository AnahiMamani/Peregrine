const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// Rota para renderizar o Index
router.get("/", indexController.renderIndex);

module.exports = router;