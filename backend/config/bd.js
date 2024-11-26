const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("peregrine", "root", "", {
    host: "localhost",
    dialect: "mysql",
    timezone: '-03:00'
})

//torna o sequelize visível globalmente
module.exports = sequelize;