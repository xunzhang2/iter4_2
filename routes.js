module.exports = function(app, db, testDB) {
    
    fs = require('fs');
    db.createDB("database.db");
    testDB.createDB("testdb.db");
    //count get request
    var get_num  = 0;
    var post_num = 0;

    // =========== INDEX PAGE  ==============
    app.get('/', function(req, res) {
	if ('username' in req.cookies)
	    res.redirect('/users');
	else 
	    res.sendFile(__dirname + '/views/index.html');
    });

    // =========== LOGIN PAGE  ==============
    app.get('/login', function(req, res) {
	if ('username' in req.cookies) {
	    res.redirect('/users');
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
	    res.render('home',{username:req.cookies.username});
	} else {
	    res.render('login');
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
	    res.render('login');
    });

    // ========== USER DIRECTORY ===========[need REST API]
    app.get('/usersjson', function(req, res) {
	
	    function callback(result) {
		res.locals.result=result;
		res.locals.title = "Users";
		res.json(result);
	    }
	    db.getUsers(callback);
	
    });
	    
    // ============== CHAT =============
    app.get('/chat', function(req, res) {
	    if ('username' in req.cookies)
	        db.getMessages(function(doc){
	  		res.locals.title = "Chat";
	 		res.render("chat", {result: doc});
	    });
	    else
	     res.render('login');
    });

    // ============== MEASURE PERFORMANCE =============
    app.get('/measure', function(req,res){
		if ('username' in req.cookies){
	       
	  		res.locals.title = "MeasurePerformance";
	 		res.render('performance');
	    }
	    else
	     res.render('login');
    });

    app.post('/measurechat', function(req,res){
    	// console.log(req.body.message);
    	// console.log(req.body.timestamp);
    	// console.log(req.body.username);
    	function callback(result){
    		if(result=="Messages Saved")
    			res.status(200).send("Success");
    	}
    	 testDB.saveMessages(req.body.message, req.body.timestamp, req.body.username, callback);
    });

    app.get('/measurechat', function(req,res){
    	function callback(result){
    		if(result!=undefined)
    			res.status(200).send("Success");
    	}
    	 testDB.getMessageByTimestamp(req.body.timestamp, callback);
    });
    // app.get('/measure', function(req, res) {
    //     get_num++;
    //     console.log("get_num = "+get_num);
    	
    //     db.getMessages(function(doc){
		  // res.locals.title = "Chat";
		  // res.render('/chat', {result: doc});
	   //  });
    // });

    // app.post('/measure', function(req, res) {
    // 	post_num++;
    // 	console.log("post_num = "+post_num);
	   //  testDB.saveMessages("lala","2016","meng",function(done) {
    //       console.log(done);
    //     });
    // });

// ============== PRIVATE CHAT =============
    app.get('/privatechat', function(req, res) {
		if ('username' in req.cookies)
	    	db.getPriMsg(req.cookies.username, req.param('receiver'), function(doc){
	    		res.locals.title = "PrivateChat";
				res.render("privatechat", {receiver: req.param('receiver'), result:doc});
	    	});
		else
	    	res.render('login');
    });


    // ============== ANNOUNCEMENT =============[need REST API]
    app.get('/announcejson', function(req, res) {
	function callback(result){
		res.locals.result=result;
		res.locals.title = "PostAnnouncement";
		res.json(result);
		}
	    db.getAnnouce(callback);

    });

       // ============== ANNOUNCEMENT =============
    app.get('/announce', function(req, res) {
	if ('username' in req.cookies)
	    db.getAnnouce(function(doc){
		res.locals.title = "Post Announcement";
		res.render("announce", {result: doc});
	    });
	else
	    res.render('login');
    });
 
    // ============== SET STATUS =============
    app.get('/status', function(req, res) {
	if ('username' in req.cookies) {
	    res.locals.title = "Status";

	    res.render('status');
	} else {
	    res.render('login');
	}
    });

    
    // ============== LOGOUT =============
    app.get('/logout', function(req, res) {
	res.clearCookie('username');
	res.redirect('/');
    });

    
    // =========== POST LOGIN ==============
    app.post('/login', function(req, res) {
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
		res.redirect('/users');
		
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
		    	res.redirect('/users');
				});
	    	}
	    	else
	    		res.render('loginsignup',{username:username, password:password});	

	    }
	}
	db.userExists(username, password, callback);	
    });

    // =========== POST STATUS ==============
    app.post('/status', function(req, res) {
	var status = req.body.status;
	function callback(result) {
	    if (result == "Success") {
		req.session.message = "Successfully set status: " + status;
		res.redirect('/users');
	    } else {
		res.locals.failure = true;
		res.locals.message = "Error";
		res.render('status');
	    }
	}
	db.setStatus(req.cookies['username'], status, callback);
    });


    //returns current time
	var current_time = function() {
		var d = new Date(Date.now());
		var datestring = d.toLocaleDateString();
		var timestring = d.toLocaleTimeString();
		return datestring.concat(" ", timestring);
	};

    
};
		
