var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
// Local database name
var DB_NAME = 'todo++';
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/' + DB_NAME;

router.get('/', function(req, res) {
    /* Gets all exising tasks from the database and returns to the client */
    console.log('getting lists');
    // Query the database for tasks
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var lists = [];
            // Query all rows in the database and act on the results
            var query = client.query('SELECT * FROM list ORDER BY id', function(err, result) {
                // Set tasks array equal to the rows returned
                lists = result.rows;
                // Return the tasks array
                res.json(lists);
                // Close the database connection
                done();
            });
        }
    });
});

router.post('/', function(req, res) {
    /* Adds a new task to the database based on client information */
    console.log('adding a list:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            client.query('INSERT INTO list (name) VALUES ($1)',
                         [req.body.name]);
            res.sendStatus(200);
            done();
        }
    });
});

router.put('/', function(req, res) {
    /* Updates the completion status of an existing task */
    console.log('updating a list:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            client.query('UPDATE list SET name=$1 WHERE id=$1',
                         [req.body.name, req.body.id]);
            res.sendStatus(200);
            done();
        }
    });
});

router.delete('/', function(req, res) {
    /* Deletes the task specified in the request */
    console.log('deleting a list:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            client.query('DELETE FROM list WHERE id=$1',
                         [req.body.id]);
            res.sendStatus(200);
            done();
        }
    });
});

module.exports = router;
