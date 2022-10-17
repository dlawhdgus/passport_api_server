const passport = require('passport')
const local = require('./strategy/localstrategy')

module.exports = () => {
    local()
}