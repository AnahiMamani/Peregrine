const db = require("../../config/bd")

//Dados acrescentados de acordo com o diagrama de classe e a modelagem de dados
const cadastro = db.sequelize.define("USUARIA_01", {
    A01_ID: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    A01_NOME: {
        type: db.Sequelize.STRING(50),
        allowNull: false
    },
    A01_APELIDO: {
        type: db.Sequelize.STRING(50),
        allowNull: true
    }, 
    A01_EMAIL: {
        type: db.Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    A01_CELULAR: {
        type: db.Sequelize.STRING(11),
        allowNull: false
    },
    A01_SENHA: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    A01_CPF: {
        type: db.Sequelize.STRING(11),
        allowNull: false,
        unique: true
    },
    A01_DATA_NASCIMENTO: {
        type: db.Sequelize.DATE,
        allowNull: false
    },
    A01_DESCRICAO: {
        type: db.Sequelize.STRING(150),
        allowNull: true
    },
    A01_ISADMIN: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    A01_CONTA_APROVADA: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    A01_DOCUMENTACAO_ENVIADA: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = cadastro
//cadastro.sync({force: true})
