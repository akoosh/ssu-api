// server.js

var express     = require('express');
var bodyParser  = require('body-parser');
var multer      = require('multer');
var mongoose    = require('mongoose');
var db          = require('./api/database')(mongoose);
var apiRouter   = require('./api/router')(express, db);
var port        = process.env.PORT || 8080;
var app         = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ dest: './api/uploads' }));
app.use('/api/v0', apiRouter);

app.listen(port);
console.log('Server listening on port ' + port);
