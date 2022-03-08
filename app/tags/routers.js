const router = require('express').Router()
const tagController = require('./controllers')

router.get('/tags', tagController.index)
router.post('/tags', tagController.store)
router.put('/tags/:id', tagController.update)
router.delete('/tags/:id', tagController.destroy)

module.exports = router