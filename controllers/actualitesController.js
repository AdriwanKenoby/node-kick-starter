'use strict'

const User = require('../DB/models/users'),
Prestation = require('../DB/models/prestations'),
Categorie = require('../DB/models/categories'),
Actualite = require('../DB/models/actualites'),
fs = require('fs');

const getAll = async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const actualites = await Actualite.find({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('actualitesView', { 
		title: 'Actualites View', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		data: actualites,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories,
		nb_actualites: nb_actualites
	});
};

const getCreatePage = async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('actualiteCreate', { 
		title: 'Actualite Create', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories,
		nb_actualites: nb_actualites
	});
};

const create = (req, res, next) => {

	const newActualite = new Actualite({
		titre: req.body.titre,
		description: req.body.description,
		startAt: new Date(req.body.startAt),
		endAt: new Date(req.body.endAt),
		imagePath: 'images/uploads/actualites/' + req.file.filename
	});

	newActualite.save((err) => {
		if (err) return next(err);
		res.redirect('/dashboard/actualites');
	});
};

const getById = (req, res, next) => {
	Actualite.findById(req.params.id, (err, user) => {
		if (err) return next(err);
		res.json(user);
	});
};

const deletePrestation = (req, res, next) => {
	Actualite.findByIdAndRemove(req.params.id, (err, doc) => {
		if (err) return next(err);
		if(fs.existsSync('./public/' + doc.imagePath)) {
			fs.unlinkSync('./public/' + doc.imagePath);
		}
		res.redirect('/dashboard/actualites');
	});
};

const getUpdatePage = async (req, res, next) => {
	const actualite = await Actualite.findById(req.params.id);
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const nb_actualites = await Actualite.countDocuments({});
	const categories = await Categorie.find({});
	res.render('actualiteCreate', {
		title: 'Actualite Update',
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		actualite: actualite,
		nb_categories: nb_categories,
		categories: categories,
		nb_actualites: nb_actualites
	});
};

const update = async (req, res, next) => {
	const actualite = await Actualite.findById(req.params.id);
	
	if(fs.existsSync('./public/' + actualite.imagePath)) {
		fs.unlinkSync('./public/' + actualite.imagePath);
	}
	
	actualite.titre = req.body.titre;
	actualite.description = req.body.description;
	actualite.imagePath = 'images/uploads/actualites/' + req.file.filename;
	actualite.startAt= new Date(req.body.startAt);
	actualite.endAt= new Date(req.body.endAt);
	
	actualite.save();
	
	res.redirect('/dashboard/actualites');
};

module.exports = {
		getAll: getAll,
		getCreatePage: getCreatePage,
		create: create,
		getById: getById,
		deletePrestation: deletePrestation,
		getUpdatePage: getUpdatePage,
		update: update
};