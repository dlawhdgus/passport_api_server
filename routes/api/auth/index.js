const router = require('express').Router()
const controller = require('./controller')
const passport = require('passport')

router.post('/sign-up', controller.SignUp)
router.post('/sign-in', passport.authenticate('local', { session: false }), controller.SignIn)
module.exports = router