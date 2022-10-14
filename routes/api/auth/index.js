const router = require('express').Router()
const passport = require('passport')
const controller = require('./controller')

router.post('/login',passport,controller.SignIn)