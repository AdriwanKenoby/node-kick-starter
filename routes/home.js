'use strict'

const express = require('express'),
router = express.Router(),
asyncHandler = require('express-async-handler'),
Prestation = require('../DB/models/prestations'),
Actualite = require('../DB/models/actualites'),
Categorie = require('../DB/models/categories');

/* GET home page. */
router.get('/home', asyncHandler(async (req, res, next) => {
	const actualites = await Actualite.find({}).sort({ startAt: 1 });
	res.render('home', { 
		title: 'Home',
		user: req.user ,
		messages: res.locals.flash,
		actualites: actualites
	});
}));

router.get('/massage', asyncHandler(async (req, res, next) => {
	const categorie = await Categorie.findOne({ name: 'Massage & Bien-être'});
	const prestations = await Prestation.find({ categorie: categorie._id });
	res.render('massage', { 
		title: 'Massage Bien Etre', 
		user: req.user , 
		messages: res.locals.flash,
		prestations: prestations
	});
}));

router.get('/about', (req, res, next) => {
	res.render('about', { 
		title: 'About', 
		user: req.user , 
		messages: res.locals.flash
	});
});

module.exports = router;
