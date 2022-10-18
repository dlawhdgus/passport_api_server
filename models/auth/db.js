const { connection } = require('mongoose')
const AuthColl = connection.collection('auth')
const crypto = require('../../modules/crypto')

exports.GetId = (callback, param = {}, errmessage) => {
    const { id, pw } = param
    const CreateUserFilter = {}

    AuthColl.findOne({ id: id })
        .then(result => {
            if (result) errmessage(true)
            else {
                CreateUserFilter.id = id
                CreateUserFilter.pw = crypto.encoding(pw)
                CreateUserFilter.createdAt = new Date()

                AuthColl.insertOne(CreateUserFilter)
                    .then(callback(true))
                    .catch(e => {if(e) throw e})
            }
        })
        .catch(e => { if (e) throw e })
}

exports.ClientCheck = (callback, param = {}) => {
    const { id, pw } = param
    AuthColl.findOne({ id: id, pw: pw })
        .then(result => { callback(result) })
        .catch(e => { if (e) throw e })
}