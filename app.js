const express = require('express')
const app = express()
const routes = require('./api/index')
const config = require('./config')
const { DBconnect } = require('./db_connect')
// const mongoose = require('mongoose').connect(config.MONGODB_CONNECT_STRING)

app.use(express.json())
app.use('/api', routes)

app.listen(config.port, () => {
    console.log('server on!!')
    DBconnect()
})