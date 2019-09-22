'use strict'

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const logger = require('morgan');
const helmet = require('helmet');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const config = require('config');
const passport = require('./utils/passport');
const db = require('./DB/db');
const acl = require('./utils/nacl');

const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const profilRouter = require('./routes/profil');
const prestationsRouter = require('./routes/prestations');
const openingHoursRouter = require('./routes/opening-hours');
const appointmentRouter = require('./routes/appointment');
const categoriesRouter = require('./routes/categories');
const actualitesRouter = require('./routes/actualites');

const app = express();

const dbCongif = config.get('dbConfig'),
dbUri = 'mongodb://' + dbCongif.host + ':' + dbCongif.port + '/' + dbCongif.index;

const store = new MongoDBStore({
	uri: dbUri,
	collection: 'sessions'
});

//Catch errors
store.on('error', function(error) {
	console.log(error);
});

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(methodOverride('_method'));
app.use(helmet());
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const secret = 'icietmaintenantbienetre';
app.use(cookieParser(secret));
app.use(session({
	secret: secret,
	name: 'sessionId',
	resave: false,
	saveUninitialized: true,
	cookie: { 
		secure: false,
		maxAge: new Date( Date.now() + 60 * 60 * 1000 ), // 1 hour
		httpOnly: true
	},
	store: store
}));

app.use(flash());
//Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
	// if there's a flash message in the session request, make it available in the response, then delete it
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.use(express.static(path.join(__dirname, 'public')));
//redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
//redirect JS popper
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd'));
//redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
//redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//redirect font awesome CSS & JS
app.use('/css', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/css'));
app.use('/js', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/js'));
app.use('/webfonts', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/webfonts'));
app.use('/flatpickr', express.static(__dirname + '/node_modules/flatpickr/dist'));

app.use('/home', homeRouter);
app.use('/', authRouter);
app.use('/dashboard', ensureLoggedIn('/login'), acl.authorize, dashboardRouter);
app.use('/dashboard/users', ensureLoggedIn('/login'), acl.authorize, usersRouter);
app.use('/profil', ensureLoggedIn('/login'), acl.authorize, profilRouter);
app.use('/dashboard/categories', ensureLoggedIn('/login'), acl.authorize, categoriesRouter);
app.use('/dashboard/prestations', ensureLoggedIn('/login'), acl.authorize, prestationsRouter);
app.use('/dashboard/actualites' , ensureLoggedIn('/login'), acl.authorize, actualitesRouter);
app.use('/dashboard/opening_hours', ensureLoggedIn('/login'), acl.authorize, openingHoursRouter);
app.use('/appointment', ensureLoggedIn('/login'), acl.authorize, appointmentRouter);
app.use('/', (req, res, next) => {
	res.redirect('/home');
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
