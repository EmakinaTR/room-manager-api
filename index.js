require('dotenv').config();

var express = require('express'),
	logger = require('morgan'),
	cors = require('cors'),
	oauth = require('./middleware/oauth'),
	controllers = require('./controllers'),
	app = express(),
	port = process.env.PORT || 3333;

// Basics
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use(oauth);
app.use('/api/v1', controllers);

// Listen
app.listen(port, function () {
	console.log('API listening on ' + port);
});