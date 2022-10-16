//토큰을 발급해주는 곳
const LocalStrategy = require('passport-local').Strategy
const { connection } = require('mongoose')
const passport = require('passport')
const AuthColl = connection.collection('auth')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const salt = crypto.randomBytes(128).toString('base64')

passport.use(new LocalStrategy(
    {
        usernameField : 'id',
        passwordField : 'pw'
    },
    function (username, password, done) {
        AuthColl.findOne({id: username, pw: password})
        .then(user => {
            if(user) {
                return done(null, user)
            }
            else {
                return done(null, false, {message : 'Incorrect password'})
            }
        })
        .catch(e => {
            console.log('Internal Server Error')
        })
    }
))

exports.SignUp = (req, res) => {
    const { id, pw } = req.body
    const SignUpFilter = {}

    if (!id || typeof id !== 'string') return res.status(400).send('id값을 다시 입력해주세요')
    if (!pw) return res.status(400).send('pw값을 입력해주세요')

    AuthColl.findOne({id : id})
    .then(result => {
        if(result) res.status(400).send('id가 존재합니다')
        else {
            const encodingPw = crypto.createHash('sha512').update(pw + salt).digest('hex')
            SignUpFilter.id = id
            SignUpFilter.pw = encodingPw
            AuthColl.insertOne(SignUpFilter)
        }
    })
    .catch(e => {if(e) throw e})
}

exports.SignIn = (req, res) => {

    
    const { user } = req
    AuthColl.findOne({id : user.id, pw : user.pw})
    .then(result => {
        if(result) res.send('success login')
    })
    .catch(e => {if(e) throw e})
}
