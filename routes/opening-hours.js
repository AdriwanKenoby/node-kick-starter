'use strict'

const express = require('express'),
router = express.Router(),
asyncHandler = require('express-async-handler'),
User = require('../DB/models/users'),
Prestation = require('../DB/models/prestations'),
Categorie = require('../DB/models/categories'),
Actualite = require('../DB/models/actualites'),
OpeningHours = require('../DB/models/opening-hours'),
simpleOpeningHours = require("simple-opening-hours").SimpleOpeningHours;

router.get('/', asyncHandler( async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const admins = await User.find({role: 'admin'});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('openingHours', { 
		title: 'Opening Hours', 
		user: req.user , 
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories,
		users: admins,
		nb_actualites: nb_actualites
	});
}));

router.post('/', (req, res, next) => {
	OpeningHours.findOne({ user: req.body.user_id } , (err, oh) => {
		if (err) return next(err);
		if (!oh) {
			let newOH = new OpeningHours({
				openingHours: new simpleOpeningHours(req.body.opening_hours).getTable(),
				user: req.body.user_id
			});
			newOH.save();
		} else {
			oh.openingHours = new simpleOpeningHours(req.body.opening_hours).getTable();
			oh.save();
		}
		res.redirect('/dashboard/opening_hours');
	});
});


module.exports = router;
