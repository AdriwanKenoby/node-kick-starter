'use strict'

const express = require('express'),
router = express.Router(),
asyncMiddleware = require('../utils/asyncMiddleware'),
Prestation = require('../DB/models/prestations');

/* GET home page. */
router.get('/', asyncMiddleware(async (req, res, next) => {
	const prestations = await Prestation.find({});
	res.render('home', { 
		title: 'Home', 
		user: req.user , 
		messages: res.locals.flash,
		prestations: prestations
	});
}));

module.exports = router;
