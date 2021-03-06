'use strict'

const express = require('express'),
router = express.Router(),
prestationsController = require('../controllers/prestationsController'),
asyncHandler = require('express-async-handler'),
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

router.get('/', asyncHandler(prestationsController.getAll));

router.get('/create', asyncHandler(prestationsController.getCreatePage));

router.post('/create', upload.single('image'), prestationsController.create);

router.get('/:id', prestationsController.getById);

router.delete('/:id', prestationsController.deletePrestation);

router.get('/update/:id', asyncHandler(prestationsController.getUpdatePage));

router.put('/update/:id', upload.single('image'), asyncHandler(prestationsController.update));

module.exports = router;
