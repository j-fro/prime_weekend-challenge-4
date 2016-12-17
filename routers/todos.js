var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
// Local database name
var DB_NAME = 'todos';
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/' + DB_NAME;

router.get('/', function(req, res) {
    /* Gets all exising tasks from the database and returns to the client */
    console.log('getting todos');
    // Query the database for tasks
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var results = [];
            var query = client.query('SELECT * FROM todos');
            // Iterate through query and push to results
            query.on('row', function(row) {
                results.push(row);
            });
            // Close the connection at end of query
            query.on('end', function() {
                done();
                res.json(results);
            });
        }
    });
});

module.exports = router;
