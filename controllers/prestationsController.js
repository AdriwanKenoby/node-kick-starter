'use strict'

const User = require('../DB/models/users'),
Prestation = require('../DB/models/prestations'),
Categorie = require('../DB/models/categories'),
Actualite = require('../DB/models/actualites'),
fs = require('fs');

const getAll = async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const prestations = await Prestation.find({}).populate('categorie');
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('prestationsView', { 
		title: 'Prestations View', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		data: prestations,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories,
		nb_actualites: nb_actualites
	});
};

const getCreatePage = async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const categories = await Categorie.find({});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('prestationCreate', { 
		title: 'Prestations Create', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories,
		categories: categories,
		nb_actualites: nb_actualites
	});
};

const create = (req, res, next) => {

	const newPrestation = new Prestation({
		titre: req.body.titre,
		sous_titre: req.body.sous_titre,
		categorie: req.body.categorie,
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
	Prestation.findById(req.params.id, (err, user) => {
		if (err) return next(err);
		res.json(user);
	});
};

const deletePrestation = (req, res, next) => {
	Prestation.findByIdAndRemove(req.params.id, (err, doc) => {
		if (err) return next(err);
		if(fs.existsSync('./public/' + doc.imagePath)) {
			fs.unlinkSync('./public/' + doc.imagePath);
		}
		
		res.redirect('/dashboard/prestations');
	});
};

const getUpdatePage = async (req, res, next) => {
	const prestation = await Prestation.findById(req.params.id).populate('categorie');
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const categories = await Categorie.find({});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('prestationCreate', {
		title: 'Prestation Update',
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		prestation: prestation,
		nb_categories: nb_categories,
		categories: categories,
		nb_actualites: nb_actualites
	});
};

const update = async (req, res, next) => {
	const prestation = await Prestation.findById(req.params.id);
	if(fs.existsSync('./public/' + prestation.imagePath)) {
		fs.unlinkSync('./public/' + prestation.imagePath);
	}
	
	prestation.titre = req.body.titre;
	prestation.sous_titre = req.body.sous_titre;
	prestation.description = req.body.description;
	prestation.duration = req.body.duration;
	prestation.prix = req.body.prix;
	prestation.imagePath = 'images/uploads/prestations/' + req.file.filename;
	prestation.categorie = req.body.categorie;
	prestation.save();
	
	res.redirect('/dashboard/prestations');
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