const { HistoryDb, UserDb } = require('../models')

const controller = {
  getTailsHistory: async (req, res) => {
    const history = await HistoryDb.findAll({
      where: {
        selection: 'Tails'
      }
    })

    res.status(200).send(history)
  },

  getHeadsHistory: async (req, res) => {
    const history = await HistoryDb.findAll({
      where: {
        selection: 'Heads'
      }
    })

    res.status(200).send(history)
  },

  insertIntoHistory: async (req, res) => {
    const payload = req.body

    if (!payload.userId) return res.status(400).send('Not logged in!')
    if (payload.betAmount < 0) return res.status(400).send("Amount can't be negative!")

    const user = await UserDb.findByPk(payload.userId)

    if (!user) {
      return res.status(400).send('User not found!')
    }

    if (!payload.demo && user.balance < payload.betAmount) {
      return res.status(400).send('Not enough money!')
    }

    if (payload.demo && user.demoBalance < payload.betAmount) {
      return res.status(400).send('Not enough money!')
    }

    if (payload.betAmount < 0) {
      return res.status(400).send('Amount must be greater than 0!')
    }

    if (payload.betAmount < 0.01) {
      return res.status(400).send('Amount must be greater than 0.01!')
    }

    await HistoryDb.create({
      selection: payload.selection,
      betAmount: payload.betAmount,
      userId: user.id,
      wallet: user.wallet,
      demo: payload.demo
    })

    if (payload.demo) {
      user.demoBalance -= payload.betAmount
    } else {
      user.balance -= payload.betAmount
    }

    await user.save()

    res.status(200).send('Success!')
  },

  getTotalBetAmount: async (req, res) => {
    const [[{ sum: heads }]] = await HistoryDb.sequelize.query("SELECT ROUND(SUM(`bet_amount`), 5) AS `sum` FROM `history` AS `history` WHERE `history`.`selection` = 'Heads';")
    const [[{ sum: tails }]] = await HistoryDb.sequelize.query("SELECT ROUND(SUM(`bet_amount`), 5) AS `sum` FROM `history` AS `history` WHERE `history`.`selection` = 'Tails';")

    res.status(200).send({
      heads,
      tails
    })
  }
}

module.exports = controller
