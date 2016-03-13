module.exports = function(app, db) {
    fs = require('fs');
    var db = require('./database.js')();
    // =========== INDEX PAGE  ==============
    app.get('/', function(req, res) {
	if ('username' in req.cookies)
	    res.redirect('/home');
	else 
	    res.sendFile(__dirname + '/views/index.html');
    });

    // =========== LOGIN PAGE  ==============
    app.get('/login', function(req, res) {
	if ('username' in req.cookies) {
	    res.redirect('/home');
	} else {
	    res.locals.title = "Login";
	    res.render('login');
	}
    });

    // =========== HOME PAGE  ==============
    app.get('/home', function(req, res) {
	if ('username' in req.cookies) {
	    if (req.session.message) {
		res.locals.success = true;
		res.locals.message = req.session.message;
		req.session.message = null;
	    }
	    res.locals.title = "Home";
	    res.render('home');
	} else {
	    res.redirect('/');
	}
    });

    // ========== USER DIRECTORY ===========
    app.get('/users', function(req, res) {
	if ('username' in req.cookies) {
	    function callback(result) {
		res.locals.result=result;
		res.locals.title = "Users";
		res.render('users');
	    }
	    db.getUsers(callback);
	} else
	    res.redirect('/');
    });
	    
    // ============== CHAT =============
    app.get('/chat', function(req, res) {
	if ('username' in req.cookies)
	    db.getMessages(function(doc){
		console.log(doc);
		res.locals.title = "Chat";
		res.render("chat", {result: doc});
	    });
	else
	    res.redirect('/');
    });
    
    // ============== SET STATUS =============
    app.get('/status', function(req, res) {
	if ('username' in req.cookies) {
	    res.locals.title = "Status";
	    res.render('status');
	} else {
	    res.redirect('/');
	}

    });

    
    // ============== LOGOUT =============
    app.get('/logout', function(req, res) {
	res.clearCookie('username');
	res.redirect('/');
    });

    
    // =========== POST LOGIN ==============
    app.post('/login', function(req, res) {
	console.log(req.body);
	var username = req.body.username;

	if (fs.readFileSync('./banned.txt', 'utf8').split("\n").indexOf(username) > -1) {
	    res.locals.failure = true;
	    res.locals.message = "Username not allowed, please try again";
	    res.locals.title = "Login";
	    res.render('login');
	    return;
	}
	
	var password = req.body.password;
	function callback(result) {
	    if (result == "Success") {
		res.cookie('username', username, {maxAge:200000});
		req.session.message = "Welcome back, " + username;
		res.redirect('/home');
		
	    } else if (result == "Password Incorrect") {
		res.locals.failure = true;
		res.locals.message = "Password incorrect, please try again";
		res.locals.title = "Login";
		res.render('login');
		
	    } else if (result == "User does not exist") {
		db.addUser(username, password, function(done) {
		    res.cookie('username', username, {maxAge:200000});
		    req.session.message = "New user created: " + username;
		    res.redirect('/home');
		});
	    }
	    console.log("call done:" + result);
	}
	db.userExists(username, password, callback);	
    });

    // =========== POST STATUS ==============
    app.post('/status', function(req, res) {
	console.log(req.body);
	var status = req.body.status;
	function callback(result) {
	    if (result == "Success") {
		req.session.message = "Successfully set status: " + status;
		res.redirect('/home');
	    } else {
		res.locals.failure = true;
		res.locals.message = "Error";
		res.render('status');
	    }
	}
	db.setStatus(req.cookies['username'], status, callback);
    });


    
    // =========== SEND MESSAGES ==============
    app.post('/sendMessages', function(req, res) {
    	db.saveMessages(req.body.messages, "Feb", req.cookies['username'], function(done) {
    		console.log('messages saved ;)');
    		if (done == "Messages Saved") {
    			res.redirect('/chat');
    		}
    	});
    });

    
};
		
