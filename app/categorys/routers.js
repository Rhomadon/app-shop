const router = require('express').Router()
const categoryController = require('./controllers')
const { police_check } = require('../middleware')

router.get('/categories', categoryController.index)

router.post('/categories', 
police_check('create', 'Category'),
categoryController.store)

router.put('/categories/:id',
police_check('update', 'Category'),
categoryController.update)

router.delete('/categories/:id', 
police_check('delete', 'Category'),
categoryController.destroy)

module.exports = router