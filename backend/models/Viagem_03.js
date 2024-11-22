// models/Viagem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante_02'); // Importa o modelo Viajante para referência de chave estrangeira

const Viagem = sequelize.define('Viagem', {
    A03_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A03_TITULO: { type: DataTypes.STRING, allowNull: false },
    A03_SUBTITULO: { type: DataTypes.STRING, allowNull: false },  
    A03_ORIGEM: { type: DataTypes.STRING, allowNull: false },  
    A03_DESTINO: { type: DataTypes.STRING, allowNull: false },
    A03_VAGAS: { type: DataTypes.INTEGER, allowNull: false },  
    A03_CUSTO: { type: DataTypes.DOUBLE, allowNull: false },  
    A03_LOCAL_IDA: { type: DataTypes.STRING, allowNull: false },  
    A03_DATA_IDA: { type: DataTypes.DATE, allowNull: false },  
    A03_HORA_IDA: { type: DataTypes.TIME, allowNull: false },  
    A03_LOCAL_VOLTA: { type: DataTypes.STRING, allowNull: false },  
    A03_DATA_VOLTA: { type: DataTypes.DATE, allowNull: false },  
    A03_HORA_VOLTA: { type: DataTypes.TIME, allowNull: false },  
    A03_DESCRICAO: { type: DataTypes.STRING },
    A03_LINK_WHATSAPP: { type: DataTypes.STRING, allowNull: true }, 
    A02_ID_ORGANIZADORA: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        },
        allowNull: false
    },
    A03_STATUS: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'VIAGEM_03',
    timestamps: false
});

Viagem.belongsTo(Viajante, { foreignKey: 'A02_ID_ORGANIZADORA' });

module.exports = Viagem;
