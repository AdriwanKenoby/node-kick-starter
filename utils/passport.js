'use strict'

const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
RememberMeStrategy = require('passport-remember-me').Strategy,
User = require('../DB/models/users'),
Token = require('../DB/models/token'),
crypto = require('crypto');

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

passport.use('local-signin', new LocalStrategy({ 
	usernameField: 'email',
	passReqToCallback : true 
},
(req, email, password, done) => {
	User.findOne({ email: email }, (err, user) => {
		if (err) return done(err);
		if (!user) {
			return done(null, false, { message: 'User Not found.' });
		}	

		if (!user.validPassword(password) ) {
			return done(null, false, { message: 'Invalid password' });
		}
		return done(null, user);
	});
}));

passport.use('local-signup', new LocalStrategy({
	usernameField: 'email',
	passReqToCallback : true
}, 
(req, email, password, done) => {
	User.findOne( { $or: [{ email: email }, {username: req.body.username}] }, (err, user) => {
		if(err) { return done(err) }

		if(user) {
			return done(null, false, { message: 'An account with this email or username already exist' });
		}

		if(password !== req.body.confirm) {
			return done(null, false, { message: 'The password must match confirm' });
		}

		const newUser = new User({			
			username: req.body.username,
			password: password,
			email: email
		});

		newUser.save((err) => {
			if(err) {
				return done(null, false, { message: 'User validation error' });
			}
			return done(null, newUser);
		});
	});
}));

passport.use(new RememberMeStrategy(
		function(token, done) {
			Token.findOneAndRemove({ value: token })
			.populate('user')
			.exec( function (err, doc) {
				if(err) return done(err);
				if(!doc) return done(null,false);
				return done(null, doc.user);
			});
		},
		function(user, done) {
			crypto.randomBytes(64, (err, buf) => {
				const value = buf.toString('hex');
				const token = new Token({
					value: value,
					user: user._id
				});
				token.save((err) => {
					if (err) return done(err);
					console.log(value);
					return done(null, value)
				});
			});
		}
));

module.exports = passport;