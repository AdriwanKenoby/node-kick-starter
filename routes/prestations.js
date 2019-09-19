'use strict'

const express = require('express'),
router = express.Router(),
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

router.get('/create', asyncMiddleware(prestationsController.getCreatePage));

router.post('/create', upload.single('image'), prestationsController.create);

router.get('/:id', prestationsController.getById);

router.delete('/', prestationsController.deletePrestation);

router.get('/update/:id', asyncMiddleware(prestationsController.getUpdatePage));

router.put('/update/:id', upload.single('image'), asyncMiddleware(prestationsController.update));

module.exports = router;
