// models/Viagem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante_02'); // Importa o modelo Viajante para referência de chave estrangeira

const Viagem = sequelize.define('Viagem', {
    A03_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A03_DESTINO: { type: DataTypes.STRING, allowNull: false },
    A03_TITULO: { type: DataTypes.STRING, allowNull: false },
    A03_DESCRICAO: { type: DataTypes.STRING },
    A03_DATA_PARTIDA: { type: DataTypes.DATE },
    A03_DATA_RETORNO: { type: DataTypes.DATE },
    A03_GASTOS_ESTIMADOS: { type: DataTypes.DOUBLE},
    A03_PONTO_ENCONTRO: { type: DataTypes.DOUBLE},
    A02_ID_ORGANIZADORA: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        },
        allowNull: false
    },
    A03_STATUS:{type: DataTypes.STRING, allowNull: false },
    A03_INTEGRANTES:{type: DataTypes.INTEGER, allowNull: false} 
}, {
    tableName: 'VIAGEM_03',
    timestamps: false
});

Viagem.belongsTo(Viajante, { foreignKey: 'A02_ID_ORGANIZADORA' });

module.exports = Viagem;