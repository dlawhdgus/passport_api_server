const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { connection } = require('mongoose')
const AuthColl = connection.collection('auth')

const auth = () => {
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
}

module.exports = auth