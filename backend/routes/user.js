const router = require('express').Router()

const { userController } = require('../controllers')

router.post('/login', [userController.login])

router.get('/me', [userController.getCurrentUser])

router.get('/:userId', [userController.getUser])

module.exports = router
