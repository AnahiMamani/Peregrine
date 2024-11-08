// models/Viagem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Viagem = sequelize.define('Viagem', {
    A03_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A03_TITULO: { type: DataTypes.STRING, allowNull: false },
    A03_DESCRICAO: { type: DataTypes.STRING },
    A03_DATA: { type: DataTypes.DATE }
}, {
    tableName: 'VIAGEM_03',
    timestamps: false
});

module.exports = Viagem;
