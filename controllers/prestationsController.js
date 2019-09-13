'use strict'

const UserSchema = require('../DB/models/users'),
PrestationSchema = require('../DB/models/prestations'),
fs = require('fs');

const getAll = async (req, res, next) => {
	const nb_users = await UserSchema.countDocuments({});
	const prestations = await PrestationSchema.find({});
	const nb_prestations = await PrestationSchema.countDocuments({});
	res.render('prestationsView', { 
		title: 'Prestations View', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		data: prestations,
		nb_prestations: nb_prestations
	});
};

const create = (req, res, next) => {

	const newPrestation = new PrestationSchema({
		titre: req.body.titre,
		sous_titre: req.body.sous_titre,
		description: req.body.description,
		duration: req.body.duration,
		prix: req.body.prix,
		imagePath: 'images/uploads/prestations/' + req.file.filename
	});

	newPrestation.save((err) => {
		if (err) return next(err);
		res.redirect('/dashboard/prestations');
	});
};

const getById = (req, res, next) => {
	PrestationSchema.findById(req.params.id, (err, user) => {
		if (err) return next(err);
		res.json(user);
	});
};

const deletePrestation = (req, res, next) => {
	PrestationSchema.findByIdAndRemove(req.body.id, (err, doc) => {
		if (err) return next(err);
		fs.unlinkSync('./public/' + doc.imagePath);
		res.redirect('/dashboard/prestations');
	});
};

const update = async (req, res, next) => {
	const prestation = await PrestationSchema.findById(req.body.id);
	fs.unlinkSync('./public/' + prestation.imagePath);
	prestation.titre = req.body.titre;
	prestation.sous_titre = req.body.sous_titre;
	prestation.description = req.body.description;
	prestation.duration = req.body.duration;
	prestation.prix = req.body.prix;
	prestation.imagePath = 'images/uploads/prestations/' + req.file.filename;
	
	prestation.save();
	
	res.redirect('/dashboard/prestations');
};

module.exports = {
		getAll: getAll,
		create: create,
		getById: getById,
		deletePrestation: deletePrestation,
		update: update
};