const express = require('express')
const { Db } = require('mongodb')
const app = express()
const MongoClient = require('mongodb').MongoClient
const config = require('../../../config')
const ObjectId = require('mongodb').ObjectId
const DBQuery = require('../../../models/collections/board/controller')

exports.PostBoard = (req, res) => {
    try {
        const { title, nickname, body } = req.body
        const filter = {}
        if (!title || typeof title !== 'string') return res.status(400).send('title값을 다시 입력해주세요')
        else filter.title = title
        if (!nickname || typeof nickname !== 'string') return res.status(400).send('nickname값을 입력해주세요')
        else filter.nickname = nickname
        if (!body || typeof body !== 'string') return res.status(400).send('body값을 입력해주세요')
        else {
            filter.body = body
            filter.createAt = new Date().toUTCString()
        }
        exports.CreateFilter = filter
        DBQuery.CreateBoard(req, res)

    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

exports.Post404 = (req, res) => {
    res.status(404).send('Not Found')
}

exports.GetBoardAll = (req, res) => {
    try {
        DBQuery.ReadBoardAll(req, res)
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

exports.GetBoardId = (req, res) => {
    try {
        const { id } = req.params
        if (id.length !== 24) res.status(400).send('Bad Request')
        exports.Get_ObjectId = id
        DBQuery.ReadBoardId(req, res)
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

exports.Get404 = (req, res) => {
    res.status(404).send('Not Found')
}

exports.PatchBoard = (req, res) => {
    try {
        const { id } = req.params
        const { title, nickname, body } = req.body
        const updateQuery = { $set: {} }
        if (id.length !== 24) res.status(400).send('Bad Request')
        if ((!title || typeof title !== 'string') && (!nickname || typeof nickname !== 'string') && (!body || typeof body !== 'string')) return res.status(400).send('Bad Request')
        if (title && typeof title === 'string') updateQuery.$set.title = title
        if (nickname && typeof nickname === 'string') updateQuery.$set.nickname = nickname
        if (body && typeof body === 'string') updateQuery.$set.body = body

        exports.Patch_ObjectId = id
        exports.PatchUpdateQuery = updateQuery
        DBQuery.UpdateBoard(req, res)
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

exports.Patch404 = (req, res) => {
    res.status(404).send('Not Found')
}

exports.DeleteBoardId = (req, res) => {
    try {
        const { id } = req.params
        if (id.length !== 24) res.status(400).send('Bad Request')
        exports.DeleteObjectId = id
        DBQuery.DeleteOneBoard(req, res)
    } catch (error) {
        return res.status(500).send('')
    }
}

exports.DeleteManyBoard = (req, res) => {
    try {
        const { id } = req.body
        const id_filter = []
        for (let i = 0; i < id.length; i++) id_filter[i] = ObjectId(id[i])
        const filter = { _id: { $in: id_filter } }
        exports.DeleteFilter = filter
        DBQuery.DeleteManyBoard(req, res)
    } catch (error) {
        return res.status(500).send('')
    }
}

exports.Delete404 = (req, res) => {
    res.status(404).send('Not Found')
}