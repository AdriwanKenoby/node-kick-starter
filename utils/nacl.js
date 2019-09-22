'use strict'

const acl = require('express-acl');

const options = {
	yml: true,
	filename: 'nacl.yml',
	path: 'utils',
	baseUrl: '/',
	decodedObjectName: 'user'
};

acl.config(options);

module.exports = acl;