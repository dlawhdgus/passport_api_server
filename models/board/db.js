const e = require('express')
const db = require('../../db_connect')
const ObjectId = require('mongodb').ObjectId

exports.CreateBoard = (callback, param = {}, errmessage) => {
    const { title, nickname, body, id, pw } = param
    const CreateFilter = {}
    const CreateUserFilter = {}

    if (!title || typeof title !== 'string') return res.status(400).send('title값을 다시 입력해주세요')
    else CreateFilter.title = title
    if (!nickname || typeof nickname !== 'string') return res.status(400).send('nickname값을 입력해주세요')
    else CreateFilter.nickname = nickname
    if (!body || typeof body !== 'string') return res.status(400).send('body값을 입력해주세요')
    else {
        CreateFilter.body = body
        CreateFilter.createAt = new Date().toUTCString()
    }
    if (!id || typeof id !== 'string') return res.status(400).send('id값을 다시 입력해주세요')
    if (!pw) return res.status(400).send('pw값을 다시 입력해주세요')

    db.AuthColl.findOne({ id: id }, (err, result) => {
        if (result) return errmessage(true)
        else {
            let date = new Date()
            db.ArticleColl.insertOne(CreateFilter, (err, result) => { callback(true) })
            db.ArticleColl.findOne({ createAt: date.toUTCString() }, (err, result) => {
                CreateUserFilter.BoardId = result._id
                CreateUserFilter.id = id
                CreateUserFilter.pw = pw
                CreateUserFilter.createAt = new Date().toUTCString()
                db.AuthColl.insertOne(CreateUserFilter, (err, result) => { })
            })
        }
    })
}

exports.ReadBoardId = (callback, id) => {
    db.ArticleColl.findOne({ _id: ObjectId(id) }, (err, result) => { return callback(result) })
}

exports.ReadBoardAll = (callback) => {
    db.ArticleColl.find().toArray((err, result) => { return callback(result) })
}

exports.UpdateBoard = (callback, _id, param = {}, errmessage) => {
    const { title, nickname, body, id, pw } = param
    const updateQuery = { $set: {} }
    if (title && typeof title === 'string') updateQuery.$set.title = title
    if (nickname && typeof nickname === 'string') updateQuery.$set.nickname = nickname
    if (body && typeof body === 'string') updateQuery.$set.body = body
    if (updateQuery) updateQuery.$set.createAt = new Date().toUTCString()
    if (!id || typeof id !== 'string') return res.status(401).send('id값을 다시 입력해주세요')
    if (!pw) return res.status(401).send('pw값을 다시 입력해주세요')


    db.AuthColl.findOne({ id: id }, (err, result) => {
        if (!result) callback(true)
        else {
            let BoarId = result.BoardId
            if (BoarId.toString() === _id) {
                db.ArticleColl.updateOne({ _id: ObjectId(_id) }, updateQuery, (err, result) => {
                    if (result.matchedCount === 0) return callback(true)
                    else return callback(false)
                })
            }
            else errmessage(true)
        }
    })

}

exports.DeleteOneBoard = (callback, _id, param = {}, errmessage) => {
    const { id, pw } = param
    db.AuthColl.findOne({ id: id }, (err, result) => {
        if (!result) callback(true)
        else {
            let BoardId = result.BoardId
            if (BoardId.toString() === _id) {
                db.ArticleColl.deleteOne({ _id: ObjectId(_id) }, (err, result) => {
                    if (result.deletedCount === 0) return callback(true)
                    else return callback(false)
                })
            } else {
                errmessage(true)
            }
        }
    })
}

exports.DeleteManyBoard = (callback, DeleteFilter) => {
    db.ArticleColl.deleteMany(DeleteFilter, (err, result) => {
        if (result.deletedCount === 0) return callback(true)
        else return callback(false)
    })
}
