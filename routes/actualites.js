'use strict'

const express = require('express'),
router = express.Router(),
actualitesController = require('../controllers/actualitesController'),
asyncHandler = require('express-async-handler'),
multer  = require('multer'),
mime = require('mime');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/uploads/actualites')
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

router.get('/', asyncHandler(actualitesController.getAll));

router.get('/create', asyncHandler(actualitesController.getCreatePage));

router.post('/create', upload.single('image'), actualitesController.create);

router.get('/:id', actualitesController.getById);

router.delete('/:id', actualitesController.deletePrestation);

router.get('/update/:id', asyncHandler(actualitesController.getUpdatePage));

router.put('/update/:id', upload.single('image'), asyncHandler(actualitesController.update));

module.exports = router;
