"use strict";

var express = require('express');
var path = require('path');

var connect = require('connect');

var init = express();

init.use(connect.json());
init.use(connect.urlencoded());
//init.use(cors({ origin: "*" }));



//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    
    next();
}

init.use(allowCrossDomain);
//init.use(express.cookieParser());

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
