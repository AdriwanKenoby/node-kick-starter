'use strict'

const express = require('express'),
router = express.Router(),
categoriesController = require('../controllers/categoriesController'),
asyncMiddleware = require('../utils/asyncMiddleware');


router.get('/', asyncMiddleware(categoriesController.getAll));

router.get('/create', asyncMiddleware(categoriesController.getCreatePage));

router.post('/create', categoriesController.create);

router.get('/:id', categoriesController.getById);

router.delete('/', categoriesController.deleteCategorie);

router.get('/update/:id', asyncMiddleware(categoriesController.getUpdatePage));

router.put('/update/:id', asyncMiddleware(categoriesController.update));

module.exports = router;
