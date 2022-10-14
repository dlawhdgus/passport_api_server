const router = require('express').Router()

const paths = [
    '/board'
]

paths.forEach(path => router.use(path, require(`.${path}`)))


module.exports = router