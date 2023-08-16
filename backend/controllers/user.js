const jwt = require('jsonwebtoken')
const { UserDb } = require('../models')

const controller = {
  getUser: (req, res) => {},

  getCurrentUser: async (req, res) => {
    const wallet = req.query.wallet ?? null

    if (!wallet) {
      return res.status(400).send('Wallet is required')
    }

    const currentUser = await UserDb.findOne({
      where: {
        wallet
      }
    })

    return res.status(200).send(currentUser)
  },

  login: async (req, res) => {
    const wallet = req.body.wallet

    const user = await UserDb.findOne({
      where: {
        wallet: wallet
      }
    })

    if (user) {
      const token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '1h' })
      return res.status(200).send(user)
    } else {
      const newUser = await UserDb.create({ wallet })
      const token = jwt.sign({ userId: newUser.id }, 'SECRET_KEY', { expiresIn: '1h' })
      return res.status(200).send(newUser)
    }
  }
}

module.exports = controller
