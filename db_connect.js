const MongoClient = require('mongodb').MongoClient
const config = require('./config')

exports.DBconnect = () => {
    MongoClient.connect(config.MONGODB_CONNECT_STRING, (err, db) => {
        if (err) throw err
        else {
            let dbo = db.db("db")
            let ArticleColl = dbo.collection("article")
            let AuthColl = dbo.collection('auth')
            exports.ArticleColl = ArticleColl
            exports.AuthColl = AuthColl
            console.log('DB connected!!')
        }
    })
}