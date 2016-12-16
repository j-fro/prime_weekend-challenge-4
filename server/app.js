var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var port = process.env.PORT || 8080;
// Local database name
var DB_NAME = '';
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432' + DB_NAME;

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Base URL
app.get('/', function(req, res) {
    res.sendFile(path.resolve('views/index.html'));
});

// Base POST
app.post('/', function(req, res) {
    // POST stuff here
    res.sendStatus(200);
});

app.listen(port, function() {
    console.log('server listening on', port);
});

// Expose public folder
app.use(express.static('public'));
