// models/Avaliacao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante');

const Avaliacao = sequelize.define('Avaliacao', {
    A06_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A02_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        }
    },
    A06_NOTA: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'AVALIACAO_06',
    timestamps: false
});

// Relacionamento 1:N entre Viajante e Avaliacao
Viajante.hasMany(Avaliacao, { foreignKey: 'A02_ID' });
Avaliacao.belongsTo(Viajante, { foreignKey: 'A02_ID' });

module.exports = Avaliacao;
