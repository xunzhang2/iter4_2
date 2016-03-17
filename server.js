// Setup express server
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require("socket.io")(http);

// Additional extensions
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// Setup app settings
var routes = require('./routes');
var DATABASE = require('./database.js');
// set up database
var db = new DATABASE("database.db");

app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'sessionsecret' }));

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
require('./socket.js')(io, db);
require('./routes.js')(app, db);


// Start application
var PORT = 3000;
http.listen(PORT, function () {
    console.log('Server listening at port %d', PORT);
});
