var dbfile = "database.db";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbfile);

db.serialize(function() {
    db.run('CREATE TABLE Citizens ' +
	   '("username" TEXT PRIMARY KEY, "password" TEXT)');
    db.run('CREATE TABLE Messages ' +
	   '("message" TEXT, "timestampe" TEXT, "username" TEXT,' +
	   'FOREIGN KEY(username) REFERENCES Users(username))');
});

db.close();
