const router = require('express').Router()
const passport = require('passport')
const controller = require('./controller')

router.get('/signup', controller.SignUp)
router.post('/signin',passport.authenticate('local',{session : false}),controller.SignIn)
module.exports = router