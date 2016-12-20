var express = require('express');
var path = require('path');
var todos = require('../routers/todos.js');
var person = require('../routers/person.js');
var list = require('../routers/list.js');
var combined = require('../routers/combined.js');

var port = process.env.PORT || 8080;

var app = express();
// To-do router
app.use('/todos', todos);
app.use('/person', person);
app.use('/list', list);
app.use('/combined', combined);

// Base URL
app.get('/', function(req, res) {
    res.sendFile(path.resolve('views/index.html'));
});

app.listen(port, function() {
    console.log('server listening on', port);
});

// Expose public folder
app.use(express.static('public'));
app.use(express.static('node_modules/font-awesome'));
