//토큰을 발급해주는 곳
const LocalStrategy = require('passport-local').Strategy
const { connection } = require('mongoose')
const passport = require('passport')
const AuthColl = connection.collection('auth')
const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')
const config = require('../../../config')

const encoding = (password) => {
    return CryptoJS.AES.encrypt(JSON.stringify(password), config.SECRET_KEY).toString()
}
const decoding = (password) => {
    const bytes = CryptoJS.AES.decrypt(password,config.SECRET_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

passport.use(new LocalStrategy(
    {
        usernameField : 'id',
        passwordField : 'pw'
    },
    function (username, password, done) {
        AuthColl.findOne({id : username})
        .then(result => {
            if(password === decoding(result.pw)) {
                AuthColl.findOne({id: username, pw: result.pw})
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
            else return done(err)
        })
        .catch(e => {if(e) throw e})
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
            SignUpFilter.id = id
            SignUpFilter.pw = encoding(pw)
            AuthColl.insertOne(SignUpFilter)
            .then(res.send('success'))
            .catch(e => {if(e) throw e})
        }
    })
    .catch(e => {if(e) throw e})
}

exports.SignIn = (req, res) => {
    const { user } = req
    AuthColl.findOne({id : user.id, pw : user.pw})
    .then(result => {
        if(result) {
            const token = jwt.sign({user_id : result._id.toString()},
            config.SECRET_KEY,{
                expiresIn: '1h'
            })
            res.cookie('user',token)
            res.send(token)
        }
    })
    .catch(e => {if(e) throw e})
}