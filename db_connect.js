const MongoClient = require('mongodb').MongoClient
const config = require('./config')
const ObjectId = require('mongodb').ObjectId

exports.DBconnect = () => {
    MongoClient.connect(config.MONGODB_CONNECT_STRING, (err, db) => {
        if (err) throw err
        else {
            let dbo = db.db("db")
            let collection = dbo.collection("article")
            exports.collection = collection
            console.log('DB connected!!')
        }
    })
}
exports.ObjectId = ObjectId