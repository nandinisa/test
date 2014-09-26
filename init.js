"use strict";

var express = require('express');
var path = require('path');

var connect = require('connect');

var server = express();

server.use(connect.json());
server.use(connect.urlencoded());

// Set routing handler to serve all static files
// Set the directory public to serve static files
server.use(express.static(path.join(__dirname, 'client')));


// Set error handlers
// Assign a function as a handler, where error is passed as the first object
// Check for test environment and if yes, then pass on the details of the error
if (server.get('NODE_ENV') === 'test') {
    server.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            'title': err.message,
            'details': err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
server.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        'title': err.message,
        'details': {}
    });
});

module.exports = init;
