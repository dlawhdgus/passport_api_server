const router = require('express').Router()
const controller = require('./api/board/index')

router.post('/board',controller.PostBoard)
router.post('/*', controller.Post404)

router.get('/board',controller.GetBoardAll)
router.get('/board/:id',controller.GetBoardId)
router.get('/*', controller.Get404)

router.patch('/board/:id',controller.PatchBoard)
router.patch('/*', controller.Patch404)

router.delete('/board/:id',controller.DeleteBoardId)
router.delete('/board',controller.DeleteManyBoard)
router.delete('/*', controller.Delete404)

module.exports = router