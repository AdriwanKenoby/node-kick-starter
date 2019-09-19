'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const OpeningHoursSchema = Schema({
	openingHours: {
		type: Map,
		of: [String]
	},
	
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	}
});

module.exports = mongoose.model('opening-hours', OpeningHoursSchema);