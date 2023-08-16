const express = require('express')
const cors = require('cors')

const { database } = require('./config/db')
const router = require('./routes')

const app = express()
const session = require('express-session')

const { Web3 } = require('web3')

const web3Client = new Web3('wss://eth-mainnet.g.alchemy.com/v2/4BHnvrLw1zChJ_mRFynU_Bvudx1JrsXi')

const { HistoryDb, UserDb, GameDb, TransactionDb } = require('./models')

app.use(cors())
app.use(
  session({
    secret: 'your-secret-key', // Replace with your secret key
    resave: false,
    saveUninitialized: true
  })
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', router)

const GLOBAL_TIMER = 20

let globalTimer = GLOBAL_TIMER
let result = ''

setInterval(async () => {
  if (globalTimer > 0) {
    globalTimer--
  } else {
    if (result !== '') {
      return
    }

    const randomResult = Math.random() < 0.5 ? 'Heads' : 'Tails'
    result = randomResult

    setTimeout(async () => {
      const rewards = new Map()

      const history = await HistoryDb.findAll({
        where: {
          selection: result
        }
      })

      history.map(tails => {
        rewards.set(tails.userId, {
          reward: Number(tails.betAmount) + Number(tails.betAmount * 0.99),
          demo: tails.demo
        })
      })

      Array.from(rewards).map(async ([userId, payload]) => {
        const { reward, demo } = payload

        const user = await UserDb.findByPk(userId)

        if (demo) {
          await user.update({ demoBalance: Number(user.demoBalance) + Number(reward) })
        } else {
          await user.update({ balance: Number(user.balance) + Number(reward) })
        }
      })

      const loser = result === 'Heads' ? 'Tails' : 'Heads'

      await HistoryDb.destroy({
        where: {
          selection: loser
        }
      })

      await GameDb.create({ color: result })

      setTimeout(async () => {
        await HistoryDb.destroy({
          where: {
            selection: result
          }
        })

        result = ''
        globalTimer = GLOBAL_TIMER
      }, 6_000)
    }, 5_000)
  }

  processTransactions()
}, 1000)

const processTransactions = async () => {
  const transactions = await TransactionDb.findAll()

  if (!transactions.length) {
    return
  }

  transactions.map(async transaction => {
    try {
      const receipt = await web3Client.eth.getTransactionReceipt(transaction.transactionHash)

      if (receipt && receipt.status) {
        if (receipt.status === 1n) {
          const transactionDetails = await web3Client.eth.getTransaction(transaction.transactionHash)

          if (transactionDetails) {
            const user = await UserDb.findOne({
              where: {
                wallet: receipt.from
              }
            })

            if (user) {
              const newBalance = Number(user.balance) + Number(Number(transactionDetails.value.toString() / 10 ** 18).toFixed(7))
              await user.update({
                balance: newBalance
              })
            }
          }

          console.log('Transaction success!')
          await TransactionDb.destroy({
            where: {
              transactionHash: transaction.transactionHash
            }
          })
        }

        if (receipt.status === 0n) {
          console.log('Transaction failed!')
          await TransactionDb.destroy({
            where: {
              transactionHash: transaction.transactionHash
            }
          })
        }
      }
    } catch {}
  })
}

app.get('/timer', (req, res) => {
  res.status(200).send({ globalTimer })
})

app.get('/reset-timer', (req, res) => {
  globalTimer = GLOBAL_TIMER
  res.status(200).send('success!')
})

app.get('/result', (req, res) => {
  res.status(200).send({ result })
})

app.get('/last-games', async (req, res) => {
  const lastGames = await GameDb.findAll({
    limit: 8,
    order: [['id', 'DESC']]
  })

  res.status(200).send(lastGames)
})

app.post('/transaction', async (req, res) => {
  const payload = req.body

  if (!payload.transactionHash) return res.status(400).send('Transaction hash is required!')

  await TransactionDb.create({
    transactionHash: payload.transactionHash
  })
})

app.listen(1234, () => {
  console.log('Running')

  database.sync({ force: false }).then(() => {
    console.log('Database sync!')
  })
})
