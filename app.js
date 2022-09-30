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
    if(err) throw err
    const dbo = db.db("db")
    const db_article = dbo.collection("article")

    app.post('/board',(req,res) => {
        try {
            const {title,nickname,body} = req.body
            const filter = {}
            if(!title || typeof title !== 'string') return res.status(400).send('title값을 다시 입력해주세요')
            else filter.title = title
            if(!nickname || typeof nickname !== 'string') return res.status(400).send('nickname값을 입력해주세요')
            else filter.nickname = nickname
            if(!body || typeof body !== 'string') return res.status(400).send('body값을 입력해주세요')
            else{
                filter.body = body
                filter.createAt = new Date().toUTCString()
            }
            db_article.insertOne(filter,(err,result) => {
                res.send('success create')
            })
        } catch (error) {
            res.status(500).send('Internal Server Error')
        }
    })

    app.post('/*',(req, res) => {
        res.status(404).send('Not Found')
    })

    app.get('/board',(req,res) => {
        try {
            db_article.find({},{projection : {}}).toArray((err,result) => {
                res.send(result)
            })
        } catch (error) {
            return res.status(500).send('Internal Server Error')
        }
    })

    app.get('/board/:id',(req,res) => {
        try {
            const {id} = req.params
            if(id.length !== 24) res.status(400).send('Bad Request')
            db_article.find({_id : mongodb.ObjectId(id)},{projection : {}}).toArray((err,result) => {
                if(EmptyArray(result)) return res.status(404).send('Not Found')
                res.send(result)
            })
        } catch (error) {
            return res.status(500).send('Internal Server Error')
        }
    })
    
    app.get('/*',(req, res) => {
        res.status(404).send('Not Found')
    })

    app.patch('/board/:id',(req,res) => {
        try {
            const {id} = req.params
            if(id.length !== 24) res.status(400).send('Bad Request')
            const {title,nickname,body} = req.body
            const updateQuery = {}
            if((title && typeof title === 'string') || (nickname && typeof nickname === 'string') || (body && typeof body === 'string')){
                if(title) updateQuery.title = title
                if(nickname) updateQuery.nickname = nickname
                if(body) {
                    updateQuery.body = body
                    updateQuery.createAt = new Date().toUTCString()
                }
            } else {
                res.status(400).send('Bad Request')
            }
            db_article.updateOne({_id : mongodb.ObjectId(id)},{$set : updateQuery},(err,result) => {
                if(result.matchedCount < 1) res.status(404).send('Not Found')
                else res.send()
            })
        } catch (error) {
            return res.status(500).send('Internal Server Error')
        }
        
    })

    app.patch('/*',(req, res) => {
        res.status(404).send('Not Found')
    })

    app.delete('/board/:id',(req,res) => {
        try {
            const {id} = req.params
            if(id.length !== 24) res.status(400).send('Bad Request')
            db_article.deleteOne({_id : mongodb.ObjectId(id)},(err,result) => {
                if(result.deletedCount < 1) res.status(404).send('Not Found')
                else res.send()
            })
        } catch (error) {
            return res.status(500).send('')
        }
    })

    app.delete('/*',(req, res) => {
        res.status(404).send('Not Found')
    })

    app.listen(port, ()=> {
      console.log('server on!!')
    })

    function EmptyArray(arr){
        if(Array.isArray(arr) && arr.length === 0) return true
        return false
    }
});

