const router = require('express').Router()
const controller = require('./controller')

router.post('/', controller.PostBoard)

router.get('/', controller.GetBoardAll)
router.get('/:id', controller.GetBoardId)

router.patch('/:id', controller.PatchBoard)

router.delete('/:id', controller.DeleteBoardId)
router.delete('/', controller.DeleteManyBoard)

module.exports = router