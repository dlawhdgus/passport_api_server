const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { connection } = require('mongoose')
const AuthColl = connection.collection('auth')
const crypto = require('../../../modules/crypto')

module.exports = () => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'pw'
        },
        function (username, password, done) {
            AuthColl.findOne({ id: username })
                .then(result => {
                    if (result) {
                        if (password === crypto.decoding(result.pw)) {
                            AuthColl.findOne({ id: username, pw: result.pw })
                                .then(user => {
                                    if (user) {
                                        return done(null, user)
                                    }
                                    else {
                                        return done(null, false)
                                    }
                                })
                                .catch(e => { if(e) throw e})
                        }
                        else return done(null, false)
                    }
                    else return done(null, false)
                })
                .catch(e => { if (e) throw e })
        }
    ))
}