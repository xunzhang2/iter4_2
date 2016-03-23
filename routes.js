module.exports = function(app, db) {
    
    fs = require('fs');
    db.createDB("database.db");
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
		console.log("*****");
		console.log(result);
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
       // ============== ANNOUNCEMENT =============
    app.get('/announce', function(req, res) {
	if ('username' in req.cookies)
	    db.getAnnouce(function(doc){
		console.log(doc);
		res.locals.title = "Post Announcement";
		res.render("announce", {result: doc});
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
	var password = req.body.password;
	var password2 = req.body.password2;
	if (fs.readFileSync('./banned.txt', 'utf8').split("\n").toString().indexOf(username) > -1) {
	    res.locals.failure = true;
	    res.locals.message = "Username Banned";
	    res.locals.title = "Login";
	    res.render('login');
	    return;
	}
	
	
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
		    db.addUser(username, password, function(done) {
		    	res.cookie('username', username, {maxAge:200000});
		    	req.session.message = "New user created: " + username;
		    	res.redirect('/home');
		    });
	    	} else {
	    	    res.render('loginsignup',{username:username, password:password});
		}
	    }
	    console.log("call done:" + result);
	}
	db.userExists(username, password, callback);	
    });

    // =========== POST STATUS ==============
    app.post('/status', function(req, res) {
	console.log(req.cookies['username']);
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
	console.log("post status");
	console.log(status);
	db.setStatus(req.cookies['username'], status, callback);
    });


    // =============== SEARCH =================
    app.get('/search', function(req, res) {
	if ('username' in req.cookies) {
	    function callback(result) {
		res.locals.title = "Search";
		res.locals.others=result;
		res.locals.current=req.cookies['username'];
		res.render('search');
	    }
	    db.getUsers(callback);
	    
	} else
	    res.redirect('/');
    });

    // =============== SEARCH =================
    app.post('/search', function(req, res) {
	function nonStop(word) {
	    return fs.readFileSync('./stop_words.txt', 'utf8').split(",").toString().indexOf(word) == -1;
	}
	
	console.log(req.body);
	var target = req.body.target;
	if (target == "Users") {
	    console.log("searching users");
	    function usercall(result) {
		if (result.length) {
		    console.log("search : " + result);
		    res.locals.title = "Results";
		    res.locals.users=result;
		    res.render('search');
		} else {
		    function errorcall(result) {
			res.locals.title = "Result";
			res.locals.others=result;
			res.locals.current=req.cookies['username'];
			res.locals.failure = true;
			res.locals.message = "No matching users found.";
			res.render('search');
		    }
		    db.getUsers(errorcall);
		}
	    }
	    db.searchUsers(req.body.username, usercall);
	    
	} else if (target == "Status") {
	    console.log("searching statuses");
	    function statuscall(result) {
		if (result.length) {
		    console.log("search : " + result);
		    res.locals.title = "Results";
		    res.locals.status=result;
		    res.render('search');
		} else {
		    function errorcall(result) {
			res.locals.title = "Result";
			res.locals.others=result;
			res.locals.current=req.cookies['username'];
			res.locals.failure = true;
			res.locals.message = "No matching statuss found.";
			res.render('search');
		    }
		    db.getUsers(errorcall);
		}
	    }
	    db.searchStatus(req.body.code, statuscall);
	    
	} else if (target == "Announcements") {
	    console.log("searching announcements");
	    function announcall(result) {
		if (result.length) {
		    console.log("search : " + result);
		    res.locals.title = "Results";
		    res.locals.msgs=result;
		    res.render('search');
		} else {
		    function errorcall(result) {
			res.locals.title = "Result";
			res.locals.others=result;
			res.locals.current=req.cookies['username'];
			res.locals.failure = true;
			res.locals.message = "No matching announcements found.";
			res.render('search');
		    }
		    db.getUsers(errorcall);
		}		    
	    }
	    var keywords = req.body.keyword[0].split(" ").filter(nonStop);
	    db.searchAnnouncements(keywords, announcall);
	    
	} else if (target == "Public" ) {

	} else if (target == "Private") {

	} else {
	    console.log("nothing selected");
	    function errorcall(result) {
		res.locals.title = "Result";
		res.locals.others=result;
		res.locals.current=req.cookies['username'];
		res.locals.failure = true;
		res.locals.message = "An error happened, please try again.";
		res.render('search');
	    }
	    db.getUsers(errorcall);
	}
    });


    

    //returns current time
	var current_time = function() {
		var d = new Date(Date.now());
		var datestring = d.toLocaleDateString();
		var timestring = d.toLocaleTimeString();
		return datestring.concat(" ", timestring);
	};

    
};
		
