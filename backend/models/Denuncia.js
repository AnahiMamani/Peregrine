// models/Denuncia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante');
const Viagem = require('./Viagem');

const Denuncia = sequelize.define('Denuncia', {
    A05_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A02_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        }
    },
    A03_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viagem,
            key: 'A03_ID'
        }
    },
    A05_DESCRICAO: { type: DataTypes.STRING },
    A05_DATA: { type: DataTypes.DATE }
}, {
    tableName: 'DENUNCIA_05',
    timestamps: false
});

module.exports = Denuncia;
