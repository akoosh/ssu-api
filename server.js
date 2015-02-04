// server.js

var express     = require('express');
var bodyParser  = require('body-parser');
var db          = require('./api/database');
var router      = require('./api/router')(express, db);
var port        = process.env.PORT || 8080;
var app         = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/v0', router);

app.listen(port);
console.log('Server listening on port ' + port);
