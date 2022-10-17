//토큰을 발급해주는 곳
const LocalStrategy = require('passport-local').Strategy
const { connection } = require('mongoose')
const AuthColl = connection.collection('auth')
const jwt = require('jsonwebtoken')
const crypto = require('./crypto')
const config = require('../../../config')

exports.SignUp = (req, res) => {
    const { id, pw } = req.body
    const SignUpFilter = {}

    if (!id || typeof id !== 'string') return res.status(400).send('id값을 다시 입력해주세요')
    if (!pw) return res.status(400).send('pw값을 입력해주세요')

    AuthColl.findOne({ id: id })
        .then(result => {
            if (result) res.status(400).send('id가 존재합니다')
            else {
                SignUpFilter.id = id
                SignUpFilter.pw = crypto.encoding(pw)
                SignUpFilter.createAt = new Date().toUTCString()

                AuthColl.insertOne(SignUpFilter)
                    .then(res.send('success'))
                    .catch(e => { if (e) throw e })
            }
        })
        .catch(e => { if (e) throw e })
}

exports.SignIn = (req, res) => {
    const { user } = req
    AuthColl.findOne({ id: user.id, pw: user.pw })
        .then(result => {
            if (result) {
                const token = jwt.sign(
                    {
                        type: "JWT",
                        user_id: result._id.toString()
                    },
                    config.SECRET_KEY,
                    {
                        expiresIn: '1h',
                        issuer: "Lim"
                    }
                )
                res.send(`login success
${token}`)
                console.log(req.headers.authorization)
            }
        })
        .catch(e => { if (e) throw e })
}