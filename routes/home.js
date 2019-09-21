'use strict'

const express = require('express'),
router = express.Router(),
asyncHandler = require('express-async-handler'),
Prestation = require('../DB/models/prestations'),
Actualite = require('../DB/models/actualites');

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
	const prestations = await Prestation.find({});
	const actualites = await Actualite.find({});
	res.render('home', { 
		title: 'Home', 
		user: req.user , 
		messages: res.locals.flash,
		prestations: prestations,
		actualites: actualites
	});
}));

module.exports = router;
