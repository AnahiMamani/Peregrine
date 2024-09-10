const db = require("./database")

const cadastro = db.sequelize.define("cadastro", {
    nome: {
        type: db.Sequelize.TEXT
    }, 
    email: {
        type: db.Sequelize.TEXT
    },
    celular: {
        tyoe: db.Sequelize.STRING
    },
    senha: {
        type: db.Sequelize.STRING
    },
    confirmarSenha: {
        type: db.Sequelize.STRING
    }

})

const login = db.sequelize.define("login", {
    email: {
        type: db.Sequelize.STRING
    },
    senha: {
        type: db.Sequelize.STRING
    }
})

module.exports = login
login.sync({force: true})
