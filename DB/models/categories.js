'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const CategorieSchema = Schema({
	name: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('categories', CategorieSchema);