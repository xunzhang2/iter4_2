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
				      "message TEXT)");

    	 this.db.run("CREATE TABLE IF NOT EXISTS PriMsg (" + 
				      "timestamp TEXT NOT NULL, " + 
				      "username1 TEXT NOT NULL, " + 
				      "username2 TEXT NOT NULL, " + 
				      "message TEXT NOT NULL)");

    	 this.db.run("CREATE TABLE IF NOT EXISTS Announ (" + 
				      "timestamp TEXT NOT NULL, " + 
				      "username TEXT NOT NULL, " + 
				      "message TEXT NOT NULL)");
},

//=============================  VALIDATE USER INFO  ===================================  
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

//=============================   USER DIRECTORY  ===================================  
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
//=================================  PUBLIC CHAT  ===================================
database.prototype.getMessages = function(callback){
	var query = "SELECT * FROM Messages";
    	this.db.all(query, function(err, rows) {
    	    if(err) {
    		console.log(err);
    	    }
    	    callback(rows);
    	});
},
//
database.prototype.saveMessages = function(messages, timestamp, username, call){
    this.db.run("INSERT INTO Messages(message, timestamp, username) VALUES (?, ?, ?)", messages, timestamp, username);
    	call("Messages Saved");
},

//============================  POST ANNOUNCEMENT  ===================================
database.prototype.getAnnouce = function(callback){
	var query = "SELECT * FROM Announ";
    	this.db.all(query, function(err, rows) {
    	    if(err) {
    		console.log(err);
    	    }
    	    callback(rows);
    	});
},
//
database.prototype.saveAnnouce= function(messages, timestamp, username, call){
    this.db.run("INSERT INTO Announ(message, timestamp, username) VALUES (?, ?, ?)", messages, timestamp, username);
    	call("Annoucement Saved");
},

//=================================  PRIVATE CHAT  ===================================
database.prototype.getPriMsg = function(user1, user2, callback){
	var query = "SELECT * FROM PriMsg WHERE username1=? and username2=?";            
    	this.db.all(query, user1, user2, function(err, rows) {
    	    if(err) {
    		console.log(err);
    	    }
    	    callback(rows);
    	});
},
//
database.prototype.savePriMsg = function(messages, timestamp, user1, user2, call){
    this.db.run("INSERT INTO PriMsg(message, timestamp, username1, username2) VALUES (?, ?, ?, ?)", 
    	messages, timestamp, user1, user2);
    	call("Private Messages Saved");
},

//=================================  SHARE STATUS  ===================================
database.prototype.setStatus = function(){
    this.db.run("UPDATE Citizens SET status = '" +status+ "' WHERE username = '" +username+ "';");
	call("Success");
},



module.exports = database;