'use strict'

const express = require('express'),
router = express.Router(),
UserSchema = require('../DB/models/users'),
PrestationSchema = require('../DB/models/prestations'),
asyncMiddleware = require('../utils/asyncMiddleware');

router.get('/', asyncMiddleware( async (req, res, next) => {
	const nb_users = await UserSchema.countDocuments({});
	const nb_prestations = await PrestationSchema.countDocuments({});
	res.render('dashboard', { 
		title: 'Dashboard',
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations
	});
}));

module.exports = router;
