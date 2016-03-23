var sqlite3 = require("sqlite3").verbose();
var fs      = require("fs");

function database(filename) {
    this.db = new sqlite3.Database(filename);
} 

//=================================== DB INITIALIZATION ============================================= 

database.prototype.createDB = function(filename){
	if(fs.existsSync(filename) == false) {
			fs.openSync(filename,"w");
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
				      "message TEXT NOT NULL, " + 
				      "timestamp TEXT NOT NULL, " + 
				      "sender TEXT NOT NULL, " + 
				      "receiver TEXT NOT NULL)");


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

//============================  TEST  ===================================
database.prototype.getMessageByTimestamp = function(timestamp, callback){
	var query = "SELECT * FROM Messages WHERE timestamp='" + timestamp + "'";	
	this.db.all(query, function(err, rows){
		if(err)
			console.log(err);		
		else
			callback(rows);
	});
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
	var query = "SELECT * FROM PriMsg WHERE (sender=? and receiver=?) OR (sender=? and receiver=?)";            
    	this.db.all(query, user1, user2, user2, user1, function(err, rows) {

    	    if(err) {
    		console.log(err);
    	    }
    	    callback(rows);
    	});
},
//
database.prototype.savePriMsg = function(messages, timestamp, user1, user2, call){
    this.db.run("INSERT INTO PriMsg(message, timestamp, sender, receiver) VALUES (?, ?, ?, ?)", 
    	messages, timestamp, user1, user2);
    	call();

},

//=================================  SHARE STATUS  ===================================
database.prototype.setStatus = function(username, status, call){

    this.db.run("UPDATE Citizens SET status = '" +status+ "' WHERE username = '" +username+ "';", function(err) {
	console.log(this.changes);
	if (this.changes) {
	    call("Success");
	} else {
	    call("Error");
	}
    });
},


// SEARCH: "SELECT [col] FROM [table] WHERE [col] LIKE "%[keyword]%" OR [col]='value';
database.prototype.searchUsers = function(username, call) {
    var query = "SELECT username FROM Citizens WHERE username LIKE '%" + username + "%';";
    this.db.all(query, function(err, rows) {
	if (err)
	    console.log(err);
	call(rows);
    });
},

database.prototype.searchStatus = function(status, call) {
    var query = "SELECT username, status FROM Citizens WHERE status LIKE '%" + status + "%';";
    this.db.all(query, function(err, rows) {
	if (err)
	    console.log(err);
	call(rows);
    });
},

database.prototype.searchAnnouncements = function(keywords, call) {
    var query = "SELECT * FROM Announ WHERE message LIKE '%" + keywords.join("%' OR message LIKE '%") + "%';";
    this.db.all(query, function(err, rows) {
	if (err)
	    console.log(err);
	call(rows);
    });
},


database.prototype.searchPublic = function(keywords, call) {
    var query = "SELECT * FROM Messages WHERE message LIKE '%" + keywords.join("%' OR message LIKE '%") + "%';";
    this.db.all(query, function(err, rows) {
	if (err)
	    console.log(err);
	call(rows);
    });
},


module.exports = database;
