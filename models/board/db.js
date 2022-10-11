const { connection } = require('mongoose')
const ArticleColl = connection.collection('article')
const AuthColl = connection.collection('auth')
const ObjectId = require('mongoose').Types.ObjectId

exports.CreateBoard = (callback, param = {}, errmessage) => {
    const { title, nickname, body, id, pw } = param
    const CreateFilter = {}
    const CreateUserFilter = {}

    if (!title || typeof title !== 'string') return res.status(400).send('title값을 다시 입력해주세요')
    if (!nickname || typeof nickname !== 'string') return res.status(400).send('nickname값을 입력해주세요')
    if (!body || typeof body !== 'string') return res.status(400).send('body값을 입력해주세요')
    if (!id || typeof id !== 'string') return res.status(400).send('id값을 다시 입력해주세요')
    if (!pw) return res.status(400).send('pw값을 다시 입력해주세요')

    AuthColl.findOne({ id: id})
        .then(result => {
            if (result) errmessage(true)
            else {
                let date = new Date().toUTCString()
                CreateUserFilter.id = id
                CreateUserFilter.pw = pw
                CreateUserFilter.createAt = date
                AuthColl.insertOne(CreateUserFilter)
                AuthColl.findOne({id : id}).then(result => {
                    CreateFilter.UserId = result._id
                    CreateFilter.title = title
                    CreateFilter.nickname = nickname
                    CreateFilter.body = body
                    CreateFilter.createAt = date
                    ArticleColl.insertOne(CreateFilter)
                    .then(callback(true))
                })
                
            }
        })
}

exports.ReadBoardId = (callback, _id) => {
    ArticleColl.findOne({ _id: ObjectId(_id) })
        .then(result => callback(result))
}

exports.ReadBoardAll = (callback) => {
    ArticleColl.find().toArray()
        .then(result => callback(result))
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

    AuthColl.findOne({ id: id, pw: pw })
        .then(result => {
            if (!result) errmessage(true)
            else {
                const UserId = result._id.toString()
                ArticleColl.findOne({ _id : ObjectId(_id)})
                .then(result => {
                    if(!result) callback(true)
                    else {
                        if(result.UserId.toString() === UserId){
                            ArticleColl.updateOne({ _id: ObjectId(_id) }, updateQuery)
                                .then(result => {
                                    if (result.matchedCount === 0) return callback(true)
                                    else return callback(false)
                                })
                        }
                        else errmessage(true)
                    }
                })
            }
        })
}

exports.DeleteOneBoard = (callback, _id, param = {}, errmessage) => {
    const { id, pw } = param
    AuthColl.findOne({ id: id, pw: pw })
        .then(result => {
            if (!result) errmessage(true)
            else {
                const UserId = result._id.toString()
                ArticleColl.findOne({_id : ObjectId(_id)})
                .then(result => {
                    if(UserId === result.UserId.toString()){
                        ArticleColl.deleteOne({ _id: ObjectId(_id) })
                            .then(result => {
                                if (result.deletedCount === 0) return callback(true)
                                else return callback(false)
                            })
                    }
                    else errmessage(true)
                })
            }
        })
}

exports.DeleteManyBoard = (callback, DeleteFilter) => {
    ArticleColl.deleteMany(DeleteFilter)
        .then(result => {
            if (result.deletedCount === 0) return callback(true)
            else return callback(false)
        })
}
