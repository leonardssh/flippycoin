const router = require('express').Router()

const { historyController } = require('../controllers')

router.post('/', [historyController.insertIntoHistory])
router.get('/tails', [historyController.getTailsHistory])
router.get('/heads', [historyController.getHeadsHistory])
router.get('/total-bet-amount', [historyController.getTotalBetAmount])

module.exports = router
