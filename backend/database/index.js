const Sequelize = require('sequelize')
require('dotenv').config()
const { DB_NAME, DB_USER, DB_HOST, DB_PASS } = process.env
const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    dialect: 'mysql',
    host: DB_HOST,
    timezone: '-03:00'
})

module.exports = connection