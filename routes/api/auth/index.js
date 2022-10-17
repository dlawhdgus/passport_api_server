const router = require('express').Router()
const controller = require('./controller')
const passport = require('passport')

router.get('/signup', passport.authenticate('local', { session: false }), controller.SignUp)
router.post('/signin', passport.authenticate('local', { session: false }), controller.SignIn)
module.exports = router