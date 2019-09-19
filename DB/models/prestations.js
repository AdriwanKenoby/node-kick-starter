'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const PrestationSchema = Schema({
	titre: {
		type: String,
		required: true
	},
	sous_titre: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	prix: {
		type: Number,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	imagePath: {
		type: String,
		required: true
	},
	categorie: {
		type: Schema.Types.ObjectId,
		ref: 'categories',
		required: true
	}
});

module.exports = mongoose.model('prestations', PrestationSchema);