module.exports = function(app, db) {
    db.createDB("database.db");

    // =========== REGISTER USER  ==============
    app.post('/api/users', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	function callback(result) {
	    if (result == "Success") {
		res.status(200).send("Success");
	    } else if (result == "Password Incorrect") {
		res.status(400).send("Incorrect");
	    } else if (result == "User does not exist") {
		db.addUser(username, password, function(done) {
		    res.status(201).send("Created");
		});
	    }
	    console.log("call done:" + result);
	}
	db.userExists(username, password, callback);	
    });

    // =========== Retrieve Users  ==============
    app.get('/api/users', function(req, res) {	
	function callback(result) {
	    res.send(result);
	}
	db.getUsers(callback);
    });

    // =========== Update User Status  ==============
    app.post('/api/users/:username/status/:status', function(req, res) {
	function callback(result) {
	    if (result == "Success") {
		res.status(201).send("Status Created");
	    } else {
		res.status(404).send("Not found");
	    }
	}
	if (req.params.status != "OK" &&
	    req.params.status != "Help" &&
	    req.params.status != "Emergency") {
	    res.status(400).send("Invalid Status");
	    return;
	}
	db.setStatus(req.params.username, req.params.status, callback);
    });

    // =========== Post Public Message  ==============
    app.post('/api/messages/public', function(req, res) {
	var username  = req.body.username;
	var message   = req.body.message;
	var timestamp = req.body.timestamp
	function verify(exists) {
	    function call(result) {
		if (result == "Messages Saved") {
		    res.status(201).send("Message Created");
		} 
	    }
	    if (exists) {
		db.saveMessages(message, timestamp, username, call);
	    } else {
		res.status(404).send("Not Found");
	    }
	}
	db.checkUser(req.body.username, verify);
    });

    // =========== Get Public Message  ==============    
    app.get('/api/messages/public', function(req, res) {
	function callback(result) {
	    res.send(result);
	}
	db.getMessages(callback);
    });

    // =========== Get User's Public Message  ==============    
    app.get('/api/messages/public/:username', function(req, res) {
	function callback(result) {
	    res.send(result);
	}
	db.getUserMessages(req.params.username, callback);
    });

    // =========== Post Private Message  ==============    
    app.get('/api/messages/private', function(req, res) {
	var sender = req.body.sender;
	var target = req.body.target;
	var message= req.body.message;
	var timestamp=req.body.timestamp;
	
	function callback(result) {
	    res.send(result);
	}
	db.getUserMessages(req.params.username, callback);
    });

    	


};
