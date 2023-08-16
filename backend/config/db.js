const Sequelize = require('sequelize')

const database = new Sequelize('coinflippy', 'root', '123', {
  dialect: 'mysql',
  host: 'localhost',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    timestamps: true
  },
  logging: false
})

module.exports = { database }
