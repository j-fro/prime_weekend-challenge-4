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
    console.log('getting all');
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            combined = [];
            tasks = [];
            people = [];
            lists = [];
            // Query tasks and people
            var queryString = 'SELECT task.id AS task_id, person.id AS person_id, ';
            queryString += 'person.name AS person_name, task.list_id FROM task ';
            queryString += 'JOIN person_task ON task.id=person_task.task_id ';
            queryString += 'JOIN person ON person_task.person_id=person.id';
            var query = client.query(queryString, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    combined = result.rows;
                }
            });
            // Query tasks
            queryString = 'SELECT * FROM task';
            query = client.query(queryString, function(err, result) {
                tasks = result.rows;
            });
            // Query people
            queryString = 'SELECT * FROM person';
            query = client.query(queryString, function(err, result) {
                people = result.rows;
            });
            // Query lists
            queryString = 'SELECT * FROM list';
            query = client.query(queryString, function(err, result) {
                lists = result.rows;
            });
            query.on('end', function() {
                res.json({
                    combined: combined,
                    tasks: tasks,
                    people: people,
                    lists: lists
                });
                done();
            });
        }
    });
});

module.exports = router;
