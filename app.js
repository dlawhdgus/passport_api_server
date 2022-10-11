const express = require('express')
const app = express()
const routes = require('./api/index')
const config = require('./config')
const { dbconnect } = require('./db_connect')

app.use(express.json())
app.use('/api', routes)

app.listen(config.port, () => {
    console.log('server on!!')
    dbconnect
})