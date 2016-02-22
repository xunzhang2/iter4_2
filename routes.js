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
	if ('username' in req.cookies)
	    res.sendFile(__dirname + '/views/home.html');	    
	else
	    res.redirect('/');
    });

    // ========== USER DIRECTORY ===========
    app.get('/users', function(req, res) {
	if ('username' in req.cookies) {
	    function callback(result) {
		console.log(result);
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
	res.cookie('message', "Successfully logged out", {maxAge:20000});
	res.clearCookie('username');
	res.redirect('/');
    });

    
    // =========== POST LOGIN ==============
    app.post('/login', function(req, res) {
	console.log(req.body);
	function callback(result) {
	    if (result == "Success") {
		res.cookie('username', req.body.username, {maxAge:200000});
		res.redirect('/home');
		
	    } else if (result == "Password Incorrect") {
		res.cookie('message', "Password Incorrect", {maxAge:20000});
		res.redirect('/login');
		
	    } else if (result == "User does not exist") {
		db.addUser(req.body.username, req.body.password, function(done) {
		    res.cookie('username', req.body.username, {maxAge:200000});
		    res.redirect('/home');
		});
	    }
	    console.log("call done:" + result);
	}
	db.userExists(req.body.username, req.body.password, callback);	
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
		
