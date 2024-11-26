// models/Denuncia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Viajante = require('./Viajante_02');
const Viagem = require('./Viagem_03');

const Denuncia = sequelize.define('Denuncia', {
    A05_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A05_DESCRICAO: { type: DataTypes.TEXT,  allowNull: false  },
    A05_TITULO: { type: DataTypes.STRING,  allowNull: false  }, 
    A02_ID_DENUNCIADO: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        },
        allowNull: false
    },
    A02_ID_DENUNCIANTE: {
        type: DataTypes.INTEGER,
        references: {
            model: Viajante,
            key: 'A02_ID'
        },
        allowNull: false
    },    
    A03_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Viagem,
            key: 'A03_ID'
        },
        allowNull: true 
    },
    A05_DATA: { type: DataTypes.DATE,  allowNull: false  },
    A05_STATUS: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'DENUNCIA_05',
    timestamps: false
});

// Associações
Denuncia.belongsTo(Viagem, { foreignKey: 'A03_ID' }); // Relacionamento com Viagem para obter a data da viagem, se necessário
Denuncia.belongsTo(Viajante, { as: 'Denunciado', foreignKey: 'A02_ID_DENUNCIADO' }); // Relacionamento com o denunciado
Denuncia.belongsTo(Viajante, { as: 'Denunciante', foreignKey: 'A02_ID_DENUNCIANTE' }); // Relacionamento com o denunciante


module.exports = Denuncia;
