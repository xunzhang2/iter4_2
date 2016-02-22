var database = function () {
    var sqlite3 = require("sqlite3").verbose();
    this.db = new sqlite3.Database("database.db");
    
    this.userExists = function(username, password, call) {
	var query = "SELECT password FROM Citizens WHERE username='"+username+"';";
	this.db.get(query, function(err, row){
	    if (err)
		console.log(err);
	    if (row) { // if non empty result (aka username exists)
		if (row.password == password) {
		    console.log("equal");
		    call("Success");
		    return;
		} else {
		    console.log("no");
		    call("Password Incorrect");
		    return;
		}
	    }
	    call("User does not exist");
	    return;
	});
    };

    this.addUser = function(username, password, call) {
	this.db.run("INSERT INTO Citizens (username,password) VALUES (?,?)",username,password);
	call("User created");
    }


    this.getUsers = function(call) {
		var query = "SELECT username FROM Citizens;";
		this.db.all(query, function(err, rows) {
	    	if (err)
			console.log(err);
	    	call(rows);
		});
    }

    this.getMessages = function(callback) {
    	var query = "SELECT * FROM Messages";
    	this.db.all(query, function(err, rows) {
    		if(err) {
    			console.log(err);
    		}
    		callback(rows);
    	});
    }

    this.saveMessages = function() {

    }

    return this;
}

module.exports = database;
