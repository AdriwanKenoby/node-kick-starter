const nodemailer = require('nodemailer'),
hbs = require('nodemailer-express-handlebars');

const smtpTransport = nodemailer.createTransport({
	host: 'localhost',
	port: 1025,
	secure: false,
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