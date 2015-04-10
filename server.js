// server.js
'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var compression = require('compression');
var multer      = require('multer');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var multerOpts  = require('./api/utils/multerOptions');
var apiRouter   = require('./api/router');
var port        = process.env.PORT || 8080;
var addr	= process.env.BIND_IP || "127.0.0.1";
var app         = express();

mongoose.connect('mongodb://localhost/students');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(multer(multerOpts));
app.use(morgan('combined'));
app.use('/api/v0', apiRouter);
app.use(express.static(__dirname + '/public'));

app.listen(port, addr);
console.log('Server listening on port: ', port, " Address: ", addr);
