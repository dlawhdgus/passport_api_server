const router = require('express').Router()
const controller = require('./controller')
const passport = require('passport')

router.post('/signup', controller.SignUp)
router.post('/signin', passport.authenticate('local', { session: false }), controller.SignIn)
module.exports = router