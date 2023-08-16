const router = require('express').Router()

const userRouter = require('./user')
const historyRouter = require('./history')

router.use('/user', userRouter)
router.use('/history', historyRouter)

module.exports = router
