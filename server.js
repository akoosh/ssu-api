// server.js
'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var multer      = require('multer');
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var multerOpts  = require('./api/utils/multerOptions');
var db          = require('./api/database')(mongoose);
var apiRouter   = require('./api/router')(express, db);
var port        = process.env.PORT || 8080;
var app         = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer(multerOpts));
app.use(morgan('combined'));
app.use('/api/v0', apiRouter);
app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('Server listening on port ' + port);
