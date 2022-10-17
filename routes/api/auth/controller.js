//토큰을 발급해주는 곳
const { connection } = require('mongoose')
const AuthColl = connection.collection('auth')
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const crypto = require('../../../modules/crypto')

exports.SignUp = (req, res) => {
    const { id, pw } = req.body
    if(!id || typeof id !== 'string') res.status(400).send('Bad Request')
    if(!pw || typeof pw !== 'string') res.status(400).send('Bad Request')

    const CreateUserFilter = {}

    AuthColl.findOne({id : id})
    .then(result => {
        if(result) res.status(400).send('id가 있습니다.')
        else {
            CreateUserFilter.id = id
            CreateUserFilter.pw = crypto.encoding(pw)
            CreateUserFilter.createAt = new Date().toUTCString()

            AuthColl.insertOne(CreateUserFilter)
                .then(res.send('success'))
                .catch(e => { if (e) throw e })
        }
    })


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