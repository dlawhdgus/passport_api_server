const config = require('./config')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_CONNECT_STRING,
    {
        dbName: 'db'
    }
)

const db = mongoose.connection
exports.dbconnect = db.once("open", () => {
    console.log('DB Connected!!')
})
db.on("error", (err) => {
    console.log(err)
})

