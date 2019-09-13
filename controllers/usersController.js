'use strict'

const UserSchema = require('../DB/models/users'),
PrestationSchema = require('../DB/models/prestations'),
fs = require('fs');

const getAll = async (req, res, next) => {
	const nb_users = await UserSchema.countDocuments({});
	const users = await UserSchema.find({});
	const nb_prestations = await PrestationSchema.countDocuments({});
	res.render('users', { 
		title: 'Users management', 
		user: req.user, 
		nb_users: nb_users,
		data: users,
		nb_prestations: nb_prestations
	});
};

const getById = (req, res, next) => {
	UserSchema.findById(req.params.id, (err, user) => {
		if (err) return next(err);
		res.json(user);
	});
};

const deleteUser = (req, res, next) => {
	UserSchema.findByIdAndRemove(req.body.id, (err, doc) => {
		if (err) return next(err);
		fs.unlinkSync('./public/' + doc.avatar);
		res.redirect('/users');
	});
};

module.exports = {
		getAll: getAll,
		getById: getById,
		deleteUser: deleteUser
};