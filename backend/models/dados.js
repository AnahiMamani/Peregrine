const db = require("../../config/bd")

const cadastro = db.sequelize.define("Usuario", {
    nome: {
        type: db.Sequelize.TEXT
    }, 
    email: {
        type: db.Sequelize.TEXT
    },
    celular: {
        type: db.Sequelize.STRING
    },
    senha: {
        type: db.Sequelize.STRING
    }
})

module.exports = cadastro
//cadastro.sync({force: true})
