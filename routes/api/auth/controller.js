//토큰을 발급해주는 곳
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const AuthDB = require('../../../models/auth/db')

exports.SignUp = (req, res) => {
    try {
        const { id, pw } = req.body
        if (!id || typeof id !== 'string') res.status(400).send('Bad Request')
        if (!pw || typeof pw !== 'string') res.status(400).send('Bad Request')

        AuthDB.GetId((result => {
            if (result) res.send('success')
        }), { id, pw },
            (err => { if (err) res.status(400).send('id가 있습니다.') }))

    } catch (e) { if (e) throw e }

}

exports.SignIn = (req, res) => {
    try {
        const { user } = req
        const { id, pw } = user
        AuthDB.ClientCheck((result => {
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
        }), { id, pw })
    } catch (e) { if (e) throw e }
}