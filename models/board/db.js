const db = require('../../db_connect')
const ObjectId = require('mongodb').ObjectId
// const { connection } = require('mongoose')
// const boardColl = connection.article_collection('article')


exports.CreateBoard = (callback, param = {}) => {  //object 

    const { title, nickname, body } = param
    const CreateBoardFilter = {}

    if (!title || typeof title !== 'string') return res.status(400).send('title값을 다시 입력해주세요')
    else CreateBoardFilter.title = title
    if (!nickname || typeof nickname !== 'string') return res.status(400).send('nickname값을 입력해주세요')
    else CreateBoardFilter.nickname = nickname
    if (!body || typeof body !== 'string') return res.status(400).send('body값을 입력해주세요')
    else {
        CreateBoardFilter.body = body
        CreateBoardFilter.createAt = new Date().toUTCString()
    }

    db.article_collection.insertOne(CreateBoardFilter, (err, result) => {
        return callback(true)
    })
}
//(param = {})
exports.ReadBoardId = (callback, id) => {
    db.article_collection.findOne({ _id: ObjectId(id) }, (err, result) => { return callback(result) })
    // .then((result,err) => {return callback(result)})

}

exports.ReadBoardAll = (callback) => {
    db.article_collection.find({}).toArray((err, result) => { return callback(result) })
}

exports.UpdateBoard = (callback, id, param = {}) => {
    const { title, nickname, body } = param
    const updateQuery = { $set: {} }

    if (title && typeof title === 'string') updateQuery.$set.title = title
    if (nickname && typeof nickname === 'string') updateQuery.$set.nickname = nickname
    if (body && typeof body === 'string') updateQuery.$set.body = body

    db.article_collection.updateOne({ _id: ObjectId(id) }, updateQuery, (err, result) => {
        if (result.matchedCount === 0) return callback(true)
        else return callback(false)
    })
}

exports.DeleteOneBoard = (callback, id) => {
    db.article_collection.deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (result.deletedCount === 0) return callback(true)
        else return callback(false)
    })
}

exports.DeleteManyBoard = (callback, deleteFilter) => {
    db.article_collection.deleteMany(deleteFilter, (err, result) => {
        if (result.deletedCount === 0) return callback(true)
        else return callback(false)
    })
}

///////////////////////////////////////////auth///////////////////////////////////////////////////////

exports.CreateUser = (callback, param = {}) => {
    const { id, pw } = param
    const CreateUserFilter = {}
    
    //id 중복 체크 하기
    if (!id || typeof id !== 'string') return res.status(400).send('id값을 다시 입력해주세요')
    else CreateUserFilter.title = title
    if (!pw) return res.status(400).send('pw값을 입력해주세요')
    else {
        CreateUserFilter.body = body
        CreateUserFilter.createAt = new Date().toUTCString()
    }

    db.auth_collection.insertOne(CreateUserFilter, (err, result) => {
        return callback(result)
    })
}

