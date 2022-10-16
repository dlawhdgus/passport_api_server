const router = require('express').Router()
const passport = require('passport')
const controller = require('./controller')

router.get('/', controller.test)
router.post('/login',passport.authenticate('local',{session : false}),controller.SignIn)
module.exports = router