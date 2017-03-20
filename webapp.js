const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');

// Create Express web app
var app = express();

// Use morgan for HTTP request logging
app.use(morgan('combined'));

// Serve static assets
//app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming form-encoded HTTP bodies
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//  extended: true
//}));

// Create and manage HTTP sessions for all requests
app.use(session({
    secret: "1234",
    resave: true,
    saveUninitialized: true
}));

// Configure application routes
require('./controllers/router')(app);

// Handle 404
app.use(function (request, response, next) {
    response.status(404).json({ error: "Forbidden Request" });
});

// Unhandled errors (500)
app.use(function(err, request, response, next) {
    console.error('An application error has occurred:');
    console.error(err);
    console.error(err.stack);
    response.status(500).json({ error });
});

// Export Express app
module.exports = app;
