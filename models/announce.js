var status = require('./status.js');

function Annoucement(connect){
	this.connector = connect;
};

// constuctor
Annoucement.prototype.constuctor = Annoucement;

// get announcement
Annoucement.prototype.getAnnouce = function(callback){
	var query = "SELECT * FROM Announ";
	this.connector.db.all(query, function(err, rows) {
    	    if(err) {
    		console.log(err);
    	    }
    	    callback(rows);
    	});
};

// save accouncment
Annoucement.prototype.saveAnnouce= function(messages, timestamp, username, call){
    this.connector.db.run("INSERT INTO Announ(message, timestamp, username) VALUES (?, ?, ?)", messages, timestamp, username);
    	call("Annoucement Saved");
};

module.exports = Annoucement;