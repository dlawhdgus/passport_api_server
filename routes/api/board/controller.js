const BoardDB = require('../../../models/board/db')

exports.PostBoard = (req, res) => {
    try {
        const { title, nickname, body, id, pw } = req.body

        if (!title || typeof title !== 'string') return res.status(400).send('title값을 다시 입력해주세요')
        if (!nickname || typeof nickname !== 'string') return res.status(400).send('nickname값을 입력해주세요')
        if (!body || typeof body !== 'string') return res.status(400).send('body값을 입력해주세요')
        if (!id || typeof id !== 'string') return res.status(400).send('id값을 다시 입력해주세요')
        if (!pw) return res.status(400).send('pw값을 입력해주세요')

        BoardDB.CreateBoard(((result) => { if (result) res.send('success') }), { title, nickname, body, id, pw }, (err) => { if (err) res.status(400).send('id가 존재합니다') })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
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
        const { id : BoardId } = req.params
        if (BoardId.length !== 24) res.status(400).send('Bad Request')

        BoardDB.ReadBoardId(((result) => {
            if (!result) return res.status(404).send('Not Found')
            else return res.send(result)
        }), BoardId)
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

exports.PatchBoard = (req, res) => {
    try {
        const { id : BoardId } = req.params
        const { title, nickname, body, id, pw } = req.body
        if (BoardId.length !== 24) res.status(400).send('Bad Request')
        if ((!title || typeof title !== 'string') && (!nickname || typeof nickname !== 'string') && (!body || typeof body !== 'string')) return res.status(400).send('Bad Request')

        BoardDB.UpdateBoard(((result) => {
            if (result) res.status(404).send('Not Found')
            else res.send('success')
        }), BoardId, { title, nickname, body, id, pw }, (err => { if (err) res.status(401).send('Unauthorized') }))

    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

exports.DeleteBoardId = (req, res) => {
    try {
        const { id : BoardId } = req.params
        const { id, pw } = req.body
        if (BoardId.length !== 24) res.status(400).send('Bad Request')
        BoardDB.DeleteOneBoard(((result) => {
            if (result) res.status(404).send('Not Found')
            else res.send('success')
        }), BoardId, { id, pw }, (err => { if (err) res.status(401).send('Unauthorized') }))
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

exports.DeleteManyBoard = (req, res) => {
    try {
        const { id : BoardId } = req.body
        const id_filter = []
        for (item in BoardId) id_filter[item] = ObjectId(BoardId[item])
        const filter = { _id: { $in: id_filter } }
        BoardDB.DeleteManyBoard(((result) => {
            if (result) res.status(404).send('Not Found')
            else res.send('success')
        }), filter)
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}