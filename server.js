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
app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'sessionsecret' }));

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
require('./socket.js')(io);
require('./routes.js')(app,io);


// Start application
var PORT = 3000;
http.listen(PORT, function () {
    console.log('Server listening at port %d', PORT);
});

