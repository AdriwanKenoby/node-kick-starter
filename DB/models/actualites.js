'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const ActualiteSchema = Schema({
	titre: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	imagePath: {
		type: String,
		required: true
	},
	startAt: {
		type: Date,
		required: true
	},
	endAt: {
		type: Date,
		required: true
	},
});

module.exports = mongoose.model('actualites', ActualiteSchema);
