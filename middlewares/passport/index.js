const passport = require('passport')
const local_signin = require('./strategy/localstrategy')

module.exports = () => {
    local_signin()
}
