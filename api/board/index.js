const router = require('express').Router()
const controller = require('./controller')

router.post('/', controller.PostBoard)
router.post('/*', controller.Post404)

router.get('/', controller.GetBoardAll)
router.get('/:_id', controller.GetBoardId)
router.get('/*', controller.Get404)

router.patch('/:_id', controller.PatchBoard)
router.patch('/*', controller.Patch404)

router.delete('/:_id', controller.DeleteBoardId)
router.delete('/', controller.DeleteManyBoard)
router.delete('/*', controller.Delete404)

module.exports = router