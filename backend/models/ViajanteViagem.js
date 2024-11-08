// models/ViajanteViagem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante');
const Viagem = require('./Viagem');

const ViajanteViagem = sequelize.define('ViajanteViagem', {
    A03_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viagem,
            key: 'A03_ID'
        },
        primaryKey: true
    },
    A02_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        },
        primaryKey: true
    }
}, {
    tableName: 'VIAJANTE_VIAGEM_04',
    timestamps: false
});

// Relacionamento N:N entre Viajante e Viagem
Viajante.belongsToMany(Viagem, { through: ViajanteViagem, foreignKey: 'A02_ID' });
Viagem.belongsToMany(Viajante, { through: ViajanteViagem, foreignKey: 'A03_ID' });

module.exports = ViajanteViagem;
