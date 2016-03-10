var sqlite3 = require("sqlite3").verbose();
var fs      = require("fs");
function database() {
    this.db = new sqlite3.Database("database.db");
} 

//=================================== DB INITIALIZATION ============================================= 

database.prototype.createDB = function(){
	if(fs.existsSync("database.db") == false) {
			console.log("Creating DB file.");
			fs.openSync("database.db","w");
		}

		 this.db.run("CREATE TABLE IF NOT EXISTS Citizens (" + 
				      "username TEXT NOT NULL, " + 
				      "password TEXT NOT NULL, " +
				      "status TEXT )");

    	 this.db.run("CREATE TABLE IF NOT EXISTS Messages (" + 
				      "timestamp TEXT NOT NULL, " + 
				      "username TEXT NOT NULL, " + 
				      "message TEXT NOT NULL)");

    	 this.db.run("CREATE TABLE IF NOT EXISTS PriMsg (" + 
				      "Timestamp TEXT NOT NULL, " + 
				      "User1 TEXT NOT NULL, " + 
				      "User2 TEXT NOT NULL, " + 
				      "Message TEXT NOT NULL)");

    	 this.db.run("CREATE TABLE IF NOT EXISTS Announ (" + 
				      "Timestamp TEXT NOT NULL, " + 
				      "User TEXT NOT NULL, " + 
				      "Message TEXT NOT NULL)");
},

database.prototype.userExists = function(username, password, call){
    var query = "SELECT password FROM Citizens WHERE username='"+username+"';";
	this.db.get(query, function(err, row){
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
},
    
database.prototype.addUser = function(username, password, call){
     this.db.run("INSERT INTO Citizens (username,password) VALUES (?,?)",username,password);
		call("User created");
},

database.prototype.getUsers = function(call){
    var query = "SELECT username, status FROM Citizens;";
	this.db.all(query, function(err, rows) {
	    if (err)
		console.log(err);
	    console.log(rows);
	    call(rows);
	});
},

database.prototype.getMessages = function(callback){
	var query = "SELECT * FROM Messages";
    	this.db.all(query, function(err, rows) {
    	    if(err) {
    		console.log(err);
    	    }
    	    callback(rows);
    	});
},

database.prototype.saveMessages = function(messages, timestamp, username, call){
    this.db.run("INSERT INTO Messages(message, timestamp, username) VALUES (?, ?, ?)", messages, timestamp, username);
    	call("Messages Saved");
},

database.prototype.setStatus = function(){
    this.db.run("UPDATE Citizens SET status = '" +status+ "' WHERE username = '" +username+ "';");
	call("Success");
},



module.exports = database;