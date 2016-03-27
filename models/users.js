var status = require('./status.js');
// var db;

// constuctor
function User(connect){
	this.connector = connect;
};

User.prototype.constuctor = User();

// Add User = Save User
User.prototype.addUser = function(username, password, call){
    this.connector.db.run("INSERT INTO Citizens (username,password) VALUES (?,?)",username,password);
	call("User Added");
};

// get User
User.prototype.getUsers = function(call){
    var query = "SELECT username, status FROM Citizens;";
	this.connector.db.all(query, function(err, rows) {
	    if (err)
		console.log(err);
	    console.log(rows);
	    call(rows);
	});
};

// Set User Status
User.prototype.setStatus = function(username, status, call){
    this.connector.db.run("UPDATE Citizens SET status = '" +status+ "' WHERE username = '" +username+ "';",
	call("Success"));
	this.statusHistory.push(status);
};

// check whether User Exists
User.prototype.userExists = function(username, password, call){
    var query = "SELECT password FROM Citizens WHERE username='"+username+"';";
	console.log(this.connector);
	this.connector.db.get(query, function(err, row){
	    if (err)
		console.log(err);
	    if (row) { // if non empty result (aka username exists)
		if (row.password == password) {
		    call("Success");
		    return;
		} else {
		    call("Password Incorrect");
		    return;
			}
	    }
	    call("User does not exist");
	    return;
	});
}

module.exports = User;


