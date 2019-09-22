const nodemailer = require('nodemailer'),
hbs = require('nodemailer-express-handlebars'),
config = require('config');

const smtp = config.get('smtp');
const smtpTransport = nodemailer.createTransport({
	host: smtp.host,
	port: smtp.port,
	secure: smtp.secure,
	...(smtp.auth && {auth: smtp.auth})
});

const options = {
		viewEngine: {
			extName: '.html',
			partialsDir: './views',
			layoutsDir: './views',
			defaultLayout: 'resetPassword.html'
		},
		viewPath: './views',
		extName: '.html'
};

smtpTransport.use('compile', hbs(options));

module.exports = smtpTransport;