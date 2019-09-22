'use strict'
//Set up mongoose connection
const mongoose = require('mongoose');
const config = require('config');

const dbConfig = config.get('dbConfig');
const dbUri = "mongodb://" + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.index;

mongoose.connect(dbUri, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log("Connexion à la base OK");
});

db.once('disconnected', () => {
  console.error('Successfully disconnected from ' + dbUri);
});
