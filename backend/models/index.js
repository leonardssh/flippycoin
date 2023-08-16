const { database } = require('../config/db')

const { userModel } = require('./user')
const { historyModel } = require('./history')
const { gameModel } = require('./games')
const { transactionModel } = require('./transactions')

const User = userModel(database)
const History = historyModel(database)
const Game = gameModel(database)
const Transaction = transactionModel(database)

User.hasMany(History)

module.exports = {
  UserDb: User,
  HistoryDb: History,
  GameDb: Game,
  TransactionDb: Transaction
}
