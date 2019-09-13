'use strict'

const express = require('express');
const router = express.Router();
const multer  = require('multer');
const User = require('../DB/models/users');
const mime = require('mime');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/uploads/avatar')
	},
	filename: function (req, file, cb) {		
		cb(null, req.user.id + '.' + mime.getExtension(file.mimetype))
	}
});

const upload = multer({ 
	storage: storage,
	fileFilter: function (req, file, cb) {
		const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		return (fileTypes.indexOf(file.mimetype) === -1) ? cb(null, false) : cb(null, true) ;
	}
});

router.get('/', function(req, res, next) {
	res.render('profil', { 
		title: 'Profil',
		user: req.user ,
		messages: res.locals.flash 
	});
});

router.get('/edit', function(req, res, next) {
	res.render('profilEdit', {
		title: 'Edit profil',
		user: req.user,
		messsages: res.locals.flash
	});
});

router.post('/edit', upload.single('avatar'), function(req, res, next) {
	const fullPath = 'images/uploads/avatar/' + req.file.filename;
	const filter = { _id: req.user._id };
	const update = { avatar: fullPath };
	User.findOneAndUpdate(filter, update, function (err, doc) {
		if (err) return next(err);
		res.redirect('/profil');
	});
});

module.exports = router;
