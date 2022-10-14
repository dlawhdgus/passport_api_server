const express = require('express')
const app = express()
const routes = require('./routes/api')
const config = require('./config')
const { dbconnect } = require('./db_connect')
const passport = require('passport')

app.use(express.json())
app.use('/api', routes)

app.listen(config.port, () => {
    console.log('server on!!')
    dbconnect
})