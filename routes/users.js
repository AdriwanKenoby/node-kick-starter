'use strict'

const express = require('express'),
router = express.Router(),
usersController = require('../controllers/usersController'),
asyncMiddleware = require('../utils/asyncMiddleware');

/* GET users listing. */
router.get('/', asyncMiddleware(usersController.getAll));

router.get('/:id', usersController.getById);

router.delete('/', usersController.deleteUser);

module.exports = router;
