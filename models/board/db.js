const { connection } = require('mongoose')
const ArticleColl = connection.collection('article')
const AuthColl = connection.collection('auth')
const ObjectId = require('mongoose').Types.ObjectId
const crypto = require('../../modules/crypto')

exports.CreateBoard = (callback, param = {}, errmessage) => {
    const { title, nickname, body, id, pw } = param
    const CreateFilter = {}
    const CreateUserFilter = {}

    if (!title || typeof title !== 'string') return res.status(400).send('title값을 다시 입력해주세요')
    if (!nickname || typeof nickname !== 'string') return res.status(400).send('nickname값을 입력해주세요')
    if (!body || typeof body !== 'string') return res.status(400).send('body값을 입력해주세요')
    if (!id || typeof id !== 'string') return res.status(400).send('id값을 다시 입력해주세요')
    if (!pw) return res.status(400).send('pw값을 다시 입력해주세요')

    AuthColl.findOne({ id: id })
        .then(result => {
            if (result) errmessage(true)
            else {
                let date = new Date()
                CreateUserFilter.id = id
                CreateUserFilter.pw = crypto.encoding(pw)
                CreateUserFilter.createdAt = date
                AuthColl.insertOne(CreateUserFilter)
                AuthColl.findOne({ id: id }).then(result => {
                    CreateFilter.userid = result._id
                    CreateFilter.title = title
                    CreateFilter.nickname = nickname
                    CreateFilter.body = body
                    CreateFilter.createdAt = date
                    ArticleColl.insertOne(CreateFilter)
                        .then(callback(true))
                })

            }
        })
        .catch(err => { if (err) throw err })
}

exports.ReadBoardId = (callback, BoardId) => {
    ArticleColl.findOne({ _id: ObjectId(BoardId) })
        .then(result => callback(result))
        .catch(err => { if (err) throw err })
}

exports.ReadBoardAll = (callback) => {
    ArticleColl.find().toArray()
        .then(result => callback(result))
        .catch(err => { if (err) throw err })
}

exports.UpdateBoard = (callback, BoardId, param = {}, errmessage) => {
    const { title, nickname, body, id, pw } = param
    const updateQuery = { $set: {} }
    if (title && typeof title === 'string') updateQuery.$set.title = title
    if (nickname && typeof nickname === 'string') updateQuery.$set.nickname = nickname
    if (body && typeof body === 'string') updateQuery.$set.body = body
    if (updateQuery) updateQuery.$set.createdAt = new Date()
    if (!id || typeof id !== 'string') return res.status(401).send('id값을 다시 입력해주세요')
    if (!pw) return res.status(401).send('pw값을 다시 입력해주세요')

    AuthColl.findOne({ id: id })
        .then(result => {
            if (!result) errmessage(true)
            else {
                if (pw === crypto.decoding(result.pw)) {
                    const userid = result._id.toString()
                    ArticleColl.findOne({ _id: ObjectId(BoardId) })
                        .then(result => {
                            if (!result) callback(true)
                            else {
                                if (result.userid.toString() === userid) {
                                    ArticleColl.updateOne({ _id: ObjectId(BoardId) }, updateQuery)
                                        .then(result => {
                                            if (result.matchedCount === 0) return callback(true)
                                            else return callback(false)
                                        })
                                }
                                else errmessage(true)
                            }
                        })
                }
                else errmessage(true)
            }
        })

}

exports.DeleteOneBoard = (callback, BoardId, param = {}, errmessage) => {
    const { id, pw } = param
    AuthColl.findOne({ id: id })
        .then(result => {
            if (pw === crypto.decoding(result.pw)) {
                const userid = result._id.toString()
                ArticleColl.findOne({ _id: ObjectId(BoardId) })
                    .then(result => {
                        if (userid === result.userid.toString()) {
                            ArticleColl.deleteOne({ _id: ObjectId(BoardId) })
                                .then(result => {
                                    if (result.deletedCount === 0) return callback(true)
                                    else return callback(false)
                                })
                        }
                        else errmessage(true)
                    })
            }
            else errmessage(true)
        })
        .catch(err => { if (err) throw err })
}

exports.DeleteManyBoard = (callback, DeleteFilter) => {
    ArticleColl.deleteMany(DeleteFilter)
        .then(result => {
            if (result.deletedCount === 0) return callback(true)
            else return callback(false)
        })
        .catch(err => { if (err) throw err })
}
