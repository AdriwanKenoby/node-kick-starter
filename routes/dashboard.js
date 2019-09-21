'use strict'

const express = require('express'),
router = express.Router(),
User = require('../DB/models/users'),
Prestation = require('../DB/models/prestations'),
Categorie = require('../DB/models/categories'),
Actualite = require('../DB/models/actualites'),
asyncHandler = require('express-async-handler');

router.get('/', asyncHandler( async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('dashboard', { 
		title: 'Dashboard',
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories,
		nb_actualites: nb_actualites
	});
}));

module.exports = router;
