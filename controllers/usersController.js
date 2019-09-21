'use strict'

const User = require('../DB/models/users'),
Prestation = require('../DB/models/prestations'),
Categorie = require('../DB/models/categories'),
Actualite = require('../DB/models/actualites'),
fs = require('fs');

const getAll = async (req, res, next) => {
	const nb_users = await User.countDocuments({});
	const users = await User.find({});
	const nb_prestations = await Prestation.countDocuments({});
	const nb_categories = await Categorie.countDocuments({});
	const nb_actualites = await Actualite.countDocuments({});
	res.render('users', { 
		title: 'Users management', 
		user: req.user, 
		nb_users: nb_users,
		data: users,
		nb_prestations: nb_prestations,
		nb_categories: nb_categories,
		nb_actualites: nb_actualites
	});
};

const getById = (req, res, next) => {
	User.findById(req.params.id, (err, user) => {
		if (err) return next(err);
		res.json(user);
	});
};

const deleteUser = (req, res, next) => {
	User.findByIdAndRemove(req.params.id, (err, doc) => {
		if (err) return next(err);
		if(doc.avatar) {
			fs.unlinkSync('./public/' + doc.avatar);
		}
		res.redirect('/dashboard/users');
	});
};

module.exports = {
		getAll: getAll,
		getById: getById,
		deleteUser: deleteUser
};