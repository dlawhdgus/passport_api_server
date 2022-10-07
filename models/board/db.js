const condition = require('../../api/board/controller')
const db = require('../../db_connect')
const { ObjectId } = require('../../db_connect')

exports.CreateBoard = (callback) => {
    db.collection.insertOne(condition.CreateFilter, (err, result) => {
        return callback(true)
    })
}

exports.ReadBoardId = (callback) => {
    db.collection.findOne({ _id: ObjectId(condition.Get_ObjectId) }, (err, result) => {
        return callback(result)
    })
}

exports.ReadBoardAll = (callback) => {
    db.collection.find().toArray((err, result) => {
        return callback(result)
    })
}

exports.UpdateBoard = (callback) => {
    db.collection.updateOne({ _id: ObjectId(condition.Patch_ObjectId) }, condition.PatchUpdateQuery, (err, result) => {
        if (result.matchedCount === 0) return callback(true)
        else return callback(false)
    })
}

exports.DeleteOneBoard = (callback) => {
    db.collection.deleteOne({ _id: ObjectId(condition.DeleteObjectId) }, (err, result) => {
        if (result.deletedCount === 0) return callback(true)
        else return callback(false)
    })
}

exports.DeleteManyBoard = (callback) => {
    db.collection.deleteMany(condition.DeleteFilter, (err, result) => {
        if (result.deletedCount === 0) return callback(true)
        else return callback(false)
    })
}