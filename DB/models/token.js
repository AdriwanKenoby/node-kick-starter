'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const TokenSchema = Schema({
	value: {
		type: String,
		required: true
	},
	
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	}
});

module.exports = mongoose.model('token', TokenSchema);