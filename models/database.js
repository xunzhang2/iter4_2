var sqlite3 = require("sqlite3").verbose();
var fs = require("fs"); //??

function database() {
    this.db = new sqlite3.Database("database.db");
};

// Database Initialization
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
				      "fromUser TEXT NOT NULL, " + 
				      "toUser TEXT NOT NULL, " + 
				      "message TEXT NOT NULL)");

    	 this.db.run("CREATE TABLE IF NOT EXISTS Announ (" + 
				      "timestamp TEXT NOT NULL, " + 
				      "username TEXT NOT NULL, " + 
				      "message TEXT NOT NULL)");
}

module.exports = database;