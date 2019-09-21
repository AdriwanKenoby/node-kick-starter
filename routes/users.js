'use strict'

const express = require('express'),
router = express.Router(),
usersController = require('../controllers/usersController'),
asyncHandler = require('express-async-handler');

/* GET users listing. */
router.get('/', asyncHandler(usersController.getAll));

router.get('/:id', usersController.getById);

router.delete('/:id', usersController.deleteUser);

module.exports = router;
