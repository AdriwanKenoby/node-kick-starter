'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema,
bcrypt = require('bcryptjs'),
SALT_WORK_FACTOR = 10,
ROLE = ['admin', 'user'];

const UserSchema = Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		index: { unique: true }
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ROLE,
		required: true,
		default: 'user'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	avatar: {
		type: String,
		required: false
	}
});

UserSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);