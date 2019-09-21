'use strict'

const express = require('express'),
router = express.Router(),
asyncHandler = require('express-async-handler'),
Prestation = require('../DB/models/prestations'),
OpeningHours = require('../DB/models/opening-hours');

router.get('/', asyncHandler(async (req, res, next) => {
	const prestations = await Prestation.find({});
	const oh = await OpeningHours.findOne({user: req.user._id});
	res.render('appointment', { 
		title: 'RDV', 
		user: req.user , 
		messages: res.locals.flash,
		prestations: prestations,
		oh: oh.openingHours
	});
}));

module.exports = router;
