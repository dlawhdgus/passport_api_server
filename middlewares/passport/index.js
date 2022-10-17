const passport = require('passport')
const local_signin = require('./strategy/localstrategy')
const local_signup = require('./strategy/signup')

module.exports = () => {
    local_signin()
    local_signup()
}
