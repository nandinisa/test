"use strict";

var express = require('express');
var path = require('path');

var connect = require('connect');

var init = express();

init.use(connect.json());
init.use(connect.urlencoded());

// Set routing handler to serve all static files
// Set the directory public to serve static files
init.use(express.static(path.join(__dirname, 'client')));


// Set error handlers
// Assign a function as a handler, where error is passed as the first object
// Check for test environment and if yes, then pass on the details of the error
if (init.get('NODE_ENV') === 'test') {
    init.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            'title': err.message,
            'details': err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
init.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        'title': err.message,
        'details': {}
    });
});

module.exports = init;
