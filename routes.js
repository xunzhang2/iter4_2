module.exports = function(app, db) {

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
	if ('username' in req.cookies)
	    res.redirect('/home');
	else
	    res.sendFile(__dirname + '/views/login.html');
    });

    // =========== HOME PAGE  ==============
    app.get('/home', function(req, res) {
	if ('username' in req.cookies) {
	    if (req.session.message) {
		res.locals.success = true;
		res.locals.message = req.session.message;
		req.session.message = null;
	    }
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
			res.render("chat", {result: doc});
		});
	else
	    res.redirect('/');
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
	var password = req.body.password;
	function callback(result) {
	    if (result == "Success") {
		res.cookie('username', username, {maxAge:200000});
		req.session.message = "Welcome back, " + username;
		res.redirect('/home');
		
	    } else if (result == "Password Incorrect") {
		res.redirect('/login');
		
	    } else if (result == "User does not exist") {
		db.addUser(username, password, function(done) {
		    res.cookie('username', username, {maxAge:200000});
		    res.redirect('/home');
		});
	    }
	    console.log("call done:" + result);
	}
	db.userExists(username, password, callback);	
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
		
