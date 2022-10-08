const MongoClient = require('mongodb').MongoClient
const config = require('./config')

exports.DBconnect = () => {
    MongoClient.connect(config.MONGODB_CONNECT_STRING, (err, db) => {
        if (err) throw err
        else {
            let dbo = db.db("db")
            let Board_collection = dbo.collection("article")
            let auth_collection = dbo.collection("auth")
            module.exports = { Board_collection, auth_collection }
            console.log('DB connected!!')
        }
    })
}