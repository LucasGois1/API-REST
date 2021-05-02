const Sequelize = require('sequelize')
const connection = require('../database')

const Game = connection.define('game', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
})

Game.sync({ force: false })

module.exports = Game