const CryptoJS = require('crypto-js')
const config = require('../../config')

exports.encoding = (password) => {
    return CryptoJS.AES.encrypt(JSON.stringify(password), config.SECRET_KEY).toString()
}

exports.decoding = (password) => {
    const bytes = CryptoJS.AES.decrypt(password, config.SECRET_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
