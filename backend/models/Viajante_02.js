// models/Viajante.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Usuario = require('./Usuario_01');

const Viajante = sequelize.define('Viajante', {
    A02_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A01_ID: { // Relacionamento com a tabela de usuários
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'A01_ID'
        }
    },
    A02_NOME: { type: DataTypes.STRING, allowNull: false },
    A02_APELIDO: { type: DataTypes.STRING },
    A02_CELULAR: { type: DataTypes.STRING },
    A02_CPF: { type: DataTypes.STRING, unique: true },
    A02_DATA_NACSI: { type: DataTypes.DATE },
    A02_DESCRICAO: { type: DataTypes.STRING },

    // Campos relacionados às avaliações
    A02_NOTA: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        allowNull: false,
        get() {
            const nota = this.getDataValue('A02_NOTA');
            return nota ? parseFloat(nota).toFixed(2) : null;
        }
    },
    A02_TOTAL_AVALIACOES: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },

    A02_APROVADA: { type: DataTypes.TINYINT, defaultValue: 0 },
    A02_DOCUMENTACAO: { type: DataTypes.TINYINT, defaultValue: 0 }
}, {
    tableName: 'VIAJANTE_02',
    timestamps: false
});

Usuario.hasOne(Viajante, { foreignKey: 'A01_ID', onDelete: 'CASCADE' });
Viajante.belongsTo(Usuario, { foreignKey: 'A01_ID', onDelete: 'CASCADE' });

module.exports = Viajante;
