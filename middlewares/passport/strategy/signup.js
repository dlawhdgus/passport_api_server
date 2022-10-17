const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { connection } = require('mongoose')
const AuthColl = connection.collection('auth')
const crypto = require('../../../routes/api/auth/crypto')

module.exports = () => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'pw'
        },
        function (username, password, done) {
            AuthColl.findOne({ id: username })
                .then(result => {
                    if (!result) {
                        const user = {}
                        user.id = username
                        user.pw = crypto.encoding(password)
                        return done(null, user)
                    }
                    else return done(null, false, { message: 'Bad Request' })
                })
                .catch(e => { if (e) throw e })
        }
    ))
}