// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd'); // Seu arquivo de configuração do Sequelize

const Usuario = sequelize.define('Usuario', {
    A01_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    A01_EMAIL: { type: DataTypes.STRING, allowNull: false },
    A01_SENHA: { type: DataTypes.STRING, allowNull: false },
    A01_PERFIL: { type: DataTypes.TINYINT, allowNull: false },
    A01_STATUS: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'USUARIO_01',
    timestamps: false
});

module.exports = Usuario;
