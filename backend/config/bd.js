const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("peregrine", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

//torna o sequelize visível globalmente
module.exports = sequelize;