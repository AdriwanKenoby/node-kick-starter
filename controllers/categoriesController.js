'use strict'

const User = require('../DB/models/users'),
Prestation = require('../DB/models/prestations'),
Categorie = require('../DB/models/categories');

const getAll = async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const categories = await Categorie.find({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	res.render('categoriesView', { 
		title: 'Categories View', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		data: categories,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories
	});
};

const getCreatePage = async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	res.render('categorieCreate', { 
		title: 'Categories Create', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories
	});
};

const create = (req, res, next) => {

	const newCategorie = new Categorie({
		name: req.body.name
	});

	newCategorie.save((err) => {
		if (err) return next(err);
		res.redirect('/dashboard/categories');
	});
};

const getById = (req, res, next) => {
	Categorie.findById(req.params.id, (err, categorie) => {
		if (err) return next(err);
		res.json(categorie);
	});
};

const deleteCategorie = (req, res, next) => {
	Categorie.findByIdAndRemove(req.body.id, (err, doc) => {
		if (err) return next(err);
		res.redirect('/dashboard/categories');
	});
};

const getUpdatePage = async (req, res, next) => {
	const categorie = await Categorie.findById(req.params.id);
	const nb_users = await User.countDocuments({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	res.render('categorieCreate', {
		title: 'Categorie Update',
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		categorie: categorie,
		nb_categories: nb_categories
	});
};

const update = async (req, res, next) => {
	const categorie = await Categorie.findById(req.params.id);	
	categorie.name = req.body.name;
	categorie.save();
	res.redirect('/dashboard/categories');
};

module.exports = {
		getAll: getAll,
		getCreatePage: getCreatePage,
		create: create,
		getById: getById,
		deleteCategorie: deleteCategorie,
		getUpdatePage: getUpdatePage,
		update: update
};
