// models/Avaliacao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante_02');

const Avaliacao = sequelize.define('Avaliacao', {
    A06_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A02_ID_AVALIADOR: { // Quem está avaliando
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        }
    },
    A02_ID_AVALIADO: { // Quem está sendo avaliado
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        }
    },
    A06_NOTA: { type: DataTypes.INTEGER, allowNull: false } // Nota atribuída
}, {
    tableName: 'AVALIACAO_06',
    timestamps: false
});

// Relacionamentos
Viajante.hasMany(Avaliacao, { foreignKey: 'A02_ID_AVALIADO' });
Avaliacao.belongsTo(Viajante, { foreignKey: 'A02_ID_AVALIADO' });

Viajante.hasMany(Avaliacao, { foreignKey: 'A02_ID_AVALIADOR' });
Avaliacao.belongsTo(Viajante, { foreignKey: 'A02_ID_AVALIADOR' });

module.exports = Avaliacao;
