const router = require('express').Router()
const controller = require('./controller')

router.post('/', controller.PostBoard)
router.post('/*', controller.Post404)

router.get('/', controller.GetBoardAll)
router.get('/:id', controller.GetBoardId)
router.get('/*', controller.Get404)

router.patch('/:id', controller.PatchBoard)
router.patch('/*', controller.Patch404)

router.delete('/:id', controller.DeleteBoardId)
router.delete('/', controller.DeleteManyBoard)
router.delete('/*', controller.Delete404)

module.exports = router