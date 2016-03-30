// Constructor
function Status(connect){
	this.connector = connect;
};

Status.prototype.constuctor = Status;

// set status method
Status.prototype.setStatus = function(username, status, call){
    this.connector.db.run("UPDATE Citizens SET status = '" +status+ "' WHERE username = '" +username+ "';",
		call("Success"));
},

module.exports = Status;