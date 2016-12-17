var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
// Local database name
var DB_NAME = 'todos';
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432' + DB_NAME;

module.exports = router;
