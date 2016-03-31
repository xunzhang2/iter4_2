module.exports = function(app, db, testDB) {
   
    fs = require('fs');
    db.createDB("database.db");
    testDB.createDB("testdb.db");
    
    var isMeasuringPerformance=false;
    
    // =========== INDEX PAGE  ==============
    app.get('/', function(req, res) {
	if ('username' in req.cookies)
	    res.redirect('/users');
	else 
	    res.redirect('/login');
    });

    // =========== LOGIN PAGE  ==============
    app.get('/login', function(req, res) {
    if(isMeasuringPerformance)
    	res.render('busy');
	else if ('username' in req.cookies) {
	    res.redirect('/users');
	} else {
	    res.locals.title = "Login";
	    res.render('login');
	}
    });

    // ========== USER DIRECTORY ===========
    app.get('/users', function(req, res) {
    if(isMeasuringPerformance)
    	res.render('busy');
	else if ('username' in req.cookies) {
	    function callback(result) {
		res.locals.result=result;		
		res.locals.title = "Users";
		res.locals.success = true;
		res.locals.message=req.session.message;
		res.render('users');
	    }
	    db.getUsers(callback);
	} else
	    res.render('login');
    });

    // ========== USER DIRECTORY ===========[need REST API]
    app.get('/usersjson', function(req, res) {
		if(isMeasuringPerformance)
    		res.render('busy');
    	else{
	    	function callback(result) {
			res.locals.result=result;
			res.locals.title = "Users";
			res.json(result);
	    	}
	   		db.getUsers(callback);
			res.redirect('/');
		}
    });
	    
    // ============== CHAT =============
    app.get('/chat', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
	    else if ('username' in req.cookies)
	        db.getMessages(function(doc){
	  		res.locals.title = "Chat";
	 		res.render("chat", {result: doc});
	    });
	    else
	     res.render('login');
    });

    // ============== MEASURE PERFORMANCE =============
    app.get('/measure', function(req,res){
    	if(isMeasuringPerformance)
    		res.render('busy');
		else if ('username' in req.cookies){
	  		res.locals.title = "MeasurePerformance";
	 		res.render('performance');
	    }
	    else
	     res.render('login');
    });

    app.get('/isbusy', function(req,res){
    	console.log("busy");
    	console.log("**"+isMeasuringPerformance);
    	if(isMeasuringPerformance)    		
    	res.send({start:true}); //not equivalent to "return"!
    	else
    		res.send({start:false});

    });

	// to set flag
    app.get('/startmeasurement', function(req,res){
    	

    	isMeasuringPerformance=true;
    	// flag=true;
    	console.log("start--set flag to "+ isMeasuringPerformance);
    	// console.log("start--set flag# to "+ flag);
    });

     app.get('/stopmeasurement', function(req,res){
    	
    	isMeasuringPerformance=false;
    	console.log("stop--set flag to "+ isMeasuringPerformance);
    	
    });

    app.post('/measurechat', function(req,res){

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
    	 testDB.getMessages(callback);
    });

    app.get('/resetmeasurement', function(){
    	testDB.deleteAllMessages();
    });

// ============== PRIVATE CHAT =============
    app.get('/privatechat', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
		else if ('username' in req.cookies)
	    	db.getPriMsg(req.cookies.username, req.param('receiver'), function(doc){
	    		res.locals.title = "PrivateChat";
				res.render("privatechat", {receiver: req.param('receiver'), result:doc});
	    	});
		else
	    	res.render('login');
    });


    // ============== ANNOUNCEMENT =============[need REST API]
    app.get('/announcejson', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
    	else{
			function callback(result){
			res.locals.result=result;
			res.locals.title = "PostAnnouncement";
			res.json(result);
			}
	    	db.getAnnouce(callback);
		}
    });

       // ============== ANNOUNCEMENT =============
    app.get('/announce', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
		else if ('username' in req.cookies)
	    	db.getAnnouce(function(doc){
			res.locals.title = "Post Announcement";
			res.render("announce", {result: doc});
	   		});
		else
	    	res.render('login');
    });
 
    // ============== SET STATUS =============
    app.get('/status', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
		else if ('username' in req.cookies) {
	   		res.locals.title = "Status";
	    	res.render('status');
		} else {
	    	res.render('login');
		}
    });

    
    // ============== LOGOUT =============
    app.get('/logout', function(req, res) {
	res.cookie('username', '', {expires:new Date(1)});
	res.clearCookie('username');
	req.session.destroy();
	res.redirect('/');
    });

    
    // =========== POST LOGIN ==============
    app.post('/login', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');	
    	else{
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	if (fs.readFileSync('./banned.txt', 'utf8').split("\n").indexOf(username) > -1) {
	    res.locals.failure = true;
	    res.locals.message = "Username Banned";
	    res.locals.title = "Login";
	    res.render('login');
	    return;
	}
	
	
	function callback(result) {
	    if (result == "Success") {
			res.cookie('username', username, {maxAge:600000});
			req.session.success=true;
			req.session.message="Welcome, " + username;
			res.redirect('/users');
	    } else if (result == "Password Incorrect") {
	    	res.locals.title = "Login";
			res.locals.failure = true;
			res.locals.message = "Password incorrect, please try again";
			res.render('login');
		
	    } else if (result == "User does not exist") {
	    	if(password2==password){
				db.addUser(username, password, function(done) {
		    	res.cookie('username', username, {maxAge:200000});
		    	req.sessioin.message = "New user created: " + username;
		    	res.redirect('/users');
				});
	    	}
	    	else
	    		res.render('loginsignup',{username:username, password:password});	

	    }

	}
	db.userExists(username, password, callback);	
	}
    });

    // =========== POST STATUS ==============
    app.post('/status', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
    	else{
	var status = req.body.status;
	function callback(result) {
	    if (result == "Success") {
	    	req.session.success=true;
			req.session.message = "Successfully set status: " + status;
			res.redirect('/users');
	    } else {
			res.locals.failure = true;
			res.locals.message = "Error";
			res.render('status');
	    }
	}
	db.setStatus(req.cookies['username'], status, callback);
	}
    });


    // =============== SEARCH =================
    app.get('/search', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
		else if ('username' in req.cookies) {
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

    app.post('/search', function(req, res) {
    	if(isMeasuringPerformance)
    		res.render('busy');
    	else{
	    function nonStop(word) {
		return fs.readFileSync('./stop_words.txt', 'utf8').trim().split(",").indexOf(word) == -1 && word != "";
	    }
	    
	function error(msg) {
	    function errorcall(result) {
		res.locals.title = "Result";
		res.locals.others=result;
		res.locals.current=req.cookies['username'];
		res.locals.failure = true;
		res.locals.message = msg;
		res.render('search');
	    }
	    db.getUsers(errorcall);
	}
	

	// console.log(req.body);
	var target = req.body.target;
	    
	if (target == "Users") {
	   // console.log("searching users");
	    function noempty(x) {
		return x != "";
	    }
	    var names = req.body.username.trim().split(" ").filter(noempty);

	    if (!names.length) {
		error("No username specified");
	    } else {
		function usercall(result) {
		    if (result.length) {
			res.locals.title = "Results";
			res.locals.users=result;
			res.render('search');
		    } else {
			error("No matching users found");
		    }
		}
		db.searchUsers(names, usercall);
	    }
	    
	} else if (target == "Status") {
	    if (!req.body.code) {
		error("No status code selected");
	    } else {
		function statuscall(result) {
		    if (result.length) {
			res.locals.title = "Results";
			res.locals.status=result;
			res.render('search');
		    } else {
			error("No matching statuses found");
		    }
		}
		db.searchStatus(req.body.code, statuscall);
	    }
	} else if (target == "Announcements" || target == "Public" || target == "Private") {
	    function msgcall(result) {
		if (result.length) {
		    res.locals.title = "Results";
		    res.locals.msgs=result;
		    res.render('search');
		} else {
		    error("No matching announcements found");
		}		    
	    }

	    if (target == "Announcements") {
		var keywords = req.body.keyword[0].split(" ").filter(nonStop);
		if (!keywords.length) {
		    error("Either no keywords specified or only stop words specificed");
		} else {
		    db.searchAnnouncements(keywords, msgcall);
		}

	    } else if (target == "Public") {
		var keywords = req.body.keyword[1].split(" ").filter(nonStop);
		if (!keywords.length) {
		    error("Either no keywords specified or only stop words specificed");
		} else {
		    db.searchPublic(keywords, msgcall);
		}

	    } else {
		var k = req.body.keyword[2].split(" ").filter(nonStop);
		if (!k.length || !req.body.others) {
		    error("Please enter acceptable keywords and select private chat user");
		} else {
		    db.searchPrivate(k, req.body.others, req.cookies['username'], msgcall);
		}
	    }

	} else {
	    error("No search target selected");
	}
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
		
