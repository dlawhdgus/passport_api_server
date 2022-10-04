const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')

app.use(express.json())
app.use(routes)
//app.use('/api',require('걍로'))나중에 물어보기

app.listen(port, () => {
    console.log('server on!!')
})