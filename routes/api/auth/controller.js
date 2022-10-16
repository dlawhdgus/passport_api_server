//토큰을 발급해주는 곳
const LocalStrategy = require('passport-local').Strategy
const { connection } = require('mongoose')
const passport = require('passport')
const AuthColl = connection.collection('auth')

passport.use(new LocalStrategy(
    {
        usernameField : 'id',
        passwordField : 'pw'
    },
    function (username, password, done) {
        console.log('LocalStrategy',username, password)
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





exports.SignIn = (req, res) => {
    const { user } = req
    console.log(`id : ${user.id}`)
}

exports.test = (req, res) => {
    console.log('a')
}