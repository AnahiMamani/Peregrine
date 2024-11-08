// database/sync.js
const sequelize = require("./bd"); // Importa a conexão do banco
const Usuario = require('../models/Usuario');
const Viajante = require('../models/Viajante');
const Viagem = require('../models/Viagem');
const ViajanteViagem = require('../models/ViajanteViagem');
const Denuncia = require('../models/Denuncia');
const Avaliacao = require('../models/Avaliacao');

// Sincronizar as tabelas com o banco de dados
sequelize.sync({ alter: true }) // Usando { alter: true } para atualizar a estrutura sem perder dados
    .then(() => {
        console.log("Tabelas sincronizadas com o banco de dados.");
    })
    .catch(error => {
        console.error("Erro ao sincronizar tabelas:", error);
    });
