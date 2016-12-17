var express = require('express');
var path = require('path');
var todos = require('../routers/todos.js');

var port = process.env.PORT || 8080;

var app = express();
// To-do router
app.use('/todos', todos);

// Base URL
app.get('/', function(req, res) {
    res.sendFile(path.resolve('views/index.html'));
});

app.listen(port, function() {
    console.log('server listening on', port);
});

// Expose public folder
app.use(express.static('public'));
