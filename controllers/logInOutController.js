module.exports = function(app, user) {
    
    fs = require('fs');
    // user.createuser();

    // Index Page Route
    app.get('/', function(req, res) {
		if ('username' in req.cookies)
		    res.redirect('/home');
		else 
		    res.sendFile(__dirname + '/views/index.html');
    });

    // Log In
    app.get('/login', function(req, res) {
		if ('username' in req.cookies) {
		    res.redirect('/home');
		} else {
		    res.locals.title = "Login";
		    res.render('login');
		}
    });

    // Log Out
    app.get('/logout', function(req, res) {
		res.clearCookie('username');
		res.redirect('/');
    });

    
    // Post Log In
    app.post('/login', function(req, res) {
		console.log(req.body);
		var username = req.body.username;
	    var password = req.body.password;
	    var password2 = req.body.password2;
	    
		if (fs.readFileSync('./banned.txt', 'utf8').split("\n").toString().indexOf(username) > -1) {
		    res.locals.failure = true;
		    res.locals.message = "Username Banned";
		    res.locals.title = "Login";
		    res.render('login');
		    return;
		}
	
	// Call Back
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
	    	if(password2==password){
				user.addUser(username, password, function(done) {
			    	res.cookie('username', username, {maxAge:200000});
			    	req.session.message = "New user created: " + username;
			    	res.redirect('/home');
				});
	    	}
	    	else
	    		res.render('loginsignup',{username:username, password:password});	
	    }
	    console.log("call done:" + result);
	}
		user.userExists(username, password, callback);	
    });

    // Home
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

    // Directory
    app.get('/users', function(req, res) {
		if ('username' in req.cookies) {
		    function callback(result) {
				res.locals.result=result;
				console.log("*****");
				console.log(result);
				res.locals.title = "Users";
				res.render('users');
		    }
		    user.getUsers(callback);
		} else {
		    res.redirect('/');
		}
    });
}