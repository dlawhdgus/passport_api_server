const express = require('express')
const app = express()
const routes = require('./api/index')
const config = require('./config')
const { DBconnect } = require('./db_connect')

app.use(express.json())
app.use('/api', routes) //routes의 엔드포인트를 정해줘라 ex) /api 

app.listen(config.port, () => {
    console.log('server on!!')
    DBconnect()
})