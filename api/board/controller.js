const BoardDB = require('../../models/board/db')

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
        BoardDB.CreateBoard((result) => { if (result) res.send('success') })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

exports.Post404 = (req, res) => {
    res.status(404).send('Not Found')
}

exports.GetBoardAll = (req, res) => {
    try {
        BoardDB.ReadBoardAll((result) => res.send(result))
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
}

exports.GetBoardId = (req, res) => {
    try {
        const { id } = req.params
        if (id.length !== 24) res.status(400).send('Bad Request')
        exports.Get_ObjectId = id

        BoardDB.ReadBoardId((result) => {
            if (!result) return res.status(404).send('Not Found')
            else return res.send(result)
        })
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
        BoardDB.UpdateBoard((result) => {
            if (result) res.status(404).send('Not Found')
            else res.send('success')
        })
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
        BoardDB.DeleteOneBoard((result) => {
            if (result) res.status(404).send('Not Found')
            else res.send('success')
        })
    } catch (error) {
        return res.status(500).send('')
    }
}

exports.DeleteManyBoard = (req, res) => {
    try {
        const { _id } = req.body
        const id_filter = []
        for (item in _id) id_filter[item] = ObjectId(_id[item])
        const filter = { _id: { $in: id_filter } }
        exports.DeleteFilter = filter
        BoardDB.DeleteManyBoard((result) => {
            if (result) res.status(404).send('Not Found')
            else res.send('success')
        })
    } catch (error) {
        return res.status(500).send('')
    }
}

exports.Delete404 = (req, res) => {
    res.status(404).send('Not Found')
}