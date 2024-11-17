// models/Viajante.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');
const Usuario = require('./Usuario_01');

const Viajante = sequelize.define('Viajante', {
    A02_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A01_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'A01_ID'
        }
    },
    A02_NOME: { type: DataTypes.STRING, allowNull: false }, 
    A02_APELIDO: { type: DataTypes.STRING },
    A02_CELULAR: { type: DataTypes.STRING },
    A02_CPF: { type: DataTypes.INTEGER, unique: true },
    A02_DATA_NACSI: { type: DataTypes.DATE },
    A02_DESCRICAO: { type: DataTypes.STRING },
    A02_NOTA: { type: DataTypes.INTEGER },
    A02_APROVADA: { type: DataTypes.TINYINT, defaultValue: 0 },
    A02_DOCUMENTACAO: { type: DataTypes.TINYINT, defaultValue: 0 }
}, {
    tableName: 'VIAJANTE_02',
    timestamps: false
});

// Relacionamento 1:1 com Usuario
// Viajante.js
Usuario.hasOne(Viajante, { foreignKey: 'A01_ID' });
Viajante.belongsTo(Usuario, { foreignKey: 'A01_ID' });


module.exports = Viajante;
