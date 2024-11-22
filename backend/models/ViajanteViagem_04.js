// models/ViajanteViagem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante_02');
const Viagem = require('./Viagem_03');

const ViajanteViagem = sequelize.define('ViajanteViagem', {
    A04_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    A03_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viagem,
            key: 'A03_ID'
        },
        allowNull: false // Torna obrigatório
    },
    A02_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        },
        allowNull: false // Torna obrigatório
    }
}, {
    tableName: 'VIAJANTE_VIAGEM_04',
    timestamps: false
});

Viajante.belongsToMany(Viagem, { through: ViajanteViagem, foreignKey: 'A02_ID' });
Viagem.belongsToMany(Viajante, { through: ViajanteViagem, foreignKey: 'A03_ID' });

module.exports = ViajanteViagem;
