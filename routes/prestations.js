'use strict'

const express = require('express'),
router = express.Router(),
UserSchema = require('../DB/models/users'),
PrestationSchema = require('../DB/models/prestations'),
prestationsController = require('../controllers/prestationsController'),
asyncMiddleware = require('../utils/asyncMiddleware'),
multer  = require('multer'),
mime = require('mime');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/uploads/prestations')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
	}
});

const upload = multer({ 
	storage: storage,
	fileFilter: function (req, file, cb) {
		const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		return (fileTypes.indexOf(file.mimetype) === -1) ? cb(null, false) : cb(null, true) ;
	}
});

router.get('/', asyncMiddleware(prestationsController.getAll));

router.get('/create', asyncMiddleware(async (req, res, next) => {
	const nb_users = await UserSchema.countDocuments({});
	const nb_prestations = await PrestationSchema.countDocuments({});
	res.render('prestationCreate', { 
		title: 'Prestations Create', 
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations		
	});
}));

router.post('/create', upload.single('image'), prestationsController.create);

router.get('/:id', prestationsController.getById);

router.delete('/', prestationsController.deletePrestation);

router.get('/update/:id', asyncMiddleware(async (req, res, next) => {
	const prestation = await PrestationSchema.findById(req.params.id);
	const nb_users = await UserSchema.countDocuments({});
	const nb_prestations = await PrestationSchema.countDocuments({});
	res.render('prestationUpdate', {
		title: 'Prestation Update',
		user: req.user,
		messages: res.locals.flash,
		nb_users: nb_users,
		nb_prestations: nb_prestations,
		prestation: prestation
	});
}));

router.patch('/update', upload.single('image'), asyncMiddleware(prestationsController.update));

module.exports = router;
