'use strict'

const express = require('express'),
router = express.Router(),
passport = require('../utils/passport'),
crypto = require('crypto'),
User = require('../DB/models/users'),
Token = require('../DB/models/token'),
jwt = require('jsonwebtoken'),
transporter = require('../utils/transport'),
connetEnsureLoggedOut = require('connect-ensure-login').ensureLoggedOut,
os = require('os'),
config = require('config');

router.get('/login', connetEnsureLoggedOut('/'), (req, res, next) => {
	res.render('signin', { messages: res.locals.flash });
});

router.post('/login', passport.authenticate('local-signin', {
	//successReturnToOrRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}), 
function (req, res, next) {
	if (!req.body.remember_me) return next();
	crypto.randomBytes(64, (err, buf) => {
		const value = buf.toString('hex');
		const token = new Token({
			value: value,
			user: req.user._id
		});
		token.save((err) => {
			if (err) return next(err);
			res.cookie('remember_me', value, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
			return next();
		});
	});
},

function (req, res) {
	req.flash('success', 'Welcome ' + req.user.username + '!');
	res.redirect('/');
});

router.get('/logout', (req, res, next) => {
	req.logout();
	req.session.destroy(function (err) {
		res.redirect('/');
	});
});

router.get('/register', connetEnsureLoggedOut('/'), (req, res, next) => {
	res.render('signup', { messages: res.locals.flash });
});

router.post('/register', passport.authenticate('local-signup', {
	successReturnToOrRedirect: '/',
	failureRedirect: '/register',
	failureFlash: true
}));

router.get('/forgot', connetEnsureLoggedOut('/'), (req, res, next) => {
	res.render('forgot', { messages: res.locals.flash });
});

router.post('/forgot', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if(!user) {
			req.flash('error', 'No account with that email address exists.');
			return res.redirect('/forgot');
		}

		const secret = user.password + user.createdAt.getTime();
		const token = jwt.sign({ data: user.email }, secret, { expiresIn: '1h' });

		let mail = {
				from: config.get('smtp').sender,
				to: user.email,
				subject: 'Password',
				template: 'resetPassword',
				context: { 					
					name: user.username,
					url: 'http://' + os.hostname() + ':' + (process.env.PORT || '3000') + '/reset_password/' + user._id + '/' + token
				}
		};
		transporter.sendMail(mail, (err, info) => {
			if (err) return next(err);
			req.flash('success', info.response.toString());
			res.redirect('/login');
		});

	});
});

router.get('/reset_password/:id/:token', (req, res, next) => {
	User.findById(req.params.id, (err, user) => {
		if(!user) {
			req.flash('error', 'No account exists.');
			return res.redirect('/forgot');
		}
		const secret = user.password + user.createdAt.getTime();
		jwt.verify(req.params.token, secret, (err, decoded) => {
			if(err || decoded.data !== user.email) return next(err);
			res.render('reset_password', { id: user._id , messages: res.locals.flash });
		});
	});
});

router.post('/reset_password/:id', (req, res, next) => {
	if(req.body.password !== req.body.confirm) {
		req.flash('error', 'The password must match confirm');
		return res.redirect('back');
	}
	User.findById(req.params.id, (err, user) => {
		if(err) return next(err);
		user.password = req.body.password;
		user.save();
		req.flash('success', 'Successfully updated password');
		res.redirect('/login');
	});
});

module.exports = router;