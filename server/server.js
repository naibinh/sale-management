//(function (exports, require, module, __filename, __dirname) {});

var express = require('express');
var app = express();
var config = require('./config/config');
var logger = require('./util/logger');
var mongoose = require('mongoose');

/*
cd home/new-path/project/sale-management/
cd /Users/binhnguyen/home/new-path/tool/mongodb-osx-x86_64-3.2.11/bin
./mongod --dbpath data/db
*/
mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);
if(config.seed){
    //require('./util/seed');
    require('./create-data');
}

// setup the global middleware 
var globalMiddleware = require('./middleware/applicationMiddleware');
globalMiddleware(app);

// api router
var api = require('./api');
var auth = require('./auth/route');
// setup the api
app.use('/api', api);
app.use('/auth', auth);


// public resource
    // bootstrap
    app.use('/', express.static(__dirname + '/../public'));
    app.use('/bootstrap', express.static(__dirname + '/../node_modules/bootstrap/dist'));
    //jquery
    app.use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist'));


// error handler
app.use(function(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).send('Invalid token');
        return;
    }
    
    logger.log(err);
    res.status(err.status || 500).send(err.message);
});

//export the app
module.exports = app;