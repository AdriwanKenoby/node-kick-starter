'use strict'

const express = require('express'),
router = express.Router(),
categoriesController = require('../controllers/categoriesController'),
asyncHandler = require('express-async-handler');


router.get('/', asyncHandler(categoriesController.getAll));

router.get('/create', asyncHandler(categoriesController.getCreatePage));

router.post('/create', categoriesController.create);

router.get('/:id', categoriesController.getById);

router.delete('/:id', categoriesController.deleteCategorie);

router.get('/update/:id', asyncHandler(categoriesController.getUpdatePage));

router.put('/update/:id', asyncHandler(categoriesController.update));

module.exports = router;
