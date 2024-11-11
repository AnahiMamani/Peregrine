// database/sync.js
const sequelize = require("./bd"); // Importa a conexão do banco
const Usuario = require('../models/Usuario_01');
const Viajante = require('../models/Viajante_02');
const Viagem = require('../models/Viagem_03');
const ViajanteViagem = require('../models/ViajanteViagem_04');
const Denuncia = require('../models/Denuncia_05');
const Avaliacao = require('../models/Avaliacao_06');

// Sincronizar as tabelas com o banco de dados
sequelize.sync({ alter: true }) // Usando { alter: true } para atualizar a estrutura sem perder dados
    .then(() => {
        console.log("Tabelas sincronizadas com o banco de dados.");
    })
    .catch(error => {
        console.error("Erro ao sincronizar tabelas:", error);
    });
