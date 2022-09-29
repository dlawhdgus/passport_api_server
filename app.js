const express = require('express')
const app = express()
const config = require('./config')
const port = 3000
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.json())
app.use(express.urlencoded({extended : false}));

MongoClient.connect(config.MONGODB_CONNECT_STRING, function(err, db) {
    if (err) throw err;
    const dbo = db.db("db");
    const db_article = dbo.collection("article")

    app.post('/board',(req,res) => {
        const {title,nickname,body} = req.body
        const filter = {}
        if(!title || typeof(title) !== 'string'){return res.status(400).send('title값을 다시 입력해주세요')}
        else{filter.title = title}
        if(!nickname || typeof(nickname) !== 'string'){return res.status(400).send('nickname값을 입력해주세요')}
        else{filter.nickname = nickname}
        if(!body || typeof(body) !== 'string'){return res.status(400).send('body값을 입력해주세요')}
        else{
            filter.body = body
            filter.createAt = new Date().toUTCString()
        }
        db_article.insertOne(filter,(err,result) => {
            if(err) throw err
            else{res.send('success create')}
        })
    })

    app.get('/board',(req,res) => {
        db_article.find({},{projection : {}}).toArray((err,result) => {
            if(err) throw err
            res.send(result)
        })
    })

    app.patch('/board/:_id',(req,res) => {
        const {_id} = req.params
        const {title,nickname,body} = req.body
        const filter = {}
        if(!title || typeof(title) !== 'string'){return res.status(400).send('title값을 다시 입력해주세요')}
        else{filter.title = title}
        if(!nickname || typeof(nickname) !== 'string'){return res.status(400).send('nickname값을 입력해주세요')}
        else{filter.nickname = nickname}
        if(!body || typeof(body) !== 'string'){return res.status(400).send('body값을 입력해주세요')}
        else{
            filter.body = body
            filter.createAt = new Date().toUTCString()
        }
        db_article.updateOne({_id : mongodb.ObjectId(_id)},{$set : filter},(err,result) => {
            if(err) throw err
            res.send('success update')
        })
        
    })

    app.delete('/board/:_id',(req,res) => {
        const {_id} = req.params
        db_article.deleteOne({_id : mongodb.ObjectId(_id)},(err,result) => {
            if(err) throw err
            if(result.deletedCount === 0){
                res.status(400).send('no data')
            } else {
                res.send('success delete')
            }
        })
    })

    app.listen(port, ()=> {
      console.log('server on!!')
    })
    
    app.use((req,res,next) => {res.status(404).send('not found')})

    app.use((err,req,res,next) => {res.status(500).send('Something broke')})
});

