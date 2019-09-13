'use strict'
//Set up mongoose connection
const mongoose = require('mongoose');
const uri = require('../config/dbUri');

const dbUri = "mongodb://" + uri.host + ':' + uri.port + '/' + uri.index;

mongoose.connect(dbUri, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log("Connexion à la base OK");
});

db.once('disconnected', () => {
  console.error('Successfully disconnected from ' + dbUri);
});
