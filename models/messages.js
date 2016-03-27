var status = require('./status.js');

// Constructor
function Message(connect){
	this.connector = connect;
};

Message.prototype.constuctor = Message;

// Public message save
Message.prototype.saveMessages = function(username, messages, timestamp, call){
    this.connector.db.run("INSERT INTO Messages(message, timestamp, username) VALUES (?, ?, ?)", messages, timestamp, username);
    	// ???????
    	// call back?
    	call("Messages Saved");
}; 

// Public message get
Message.prototype.getMessages = function(callback){
	var query = "SELECT * FROM Messages";
    	this.connector.db.all(query, function(err, rows) {
    	    if(err) console.log(err);
    	    callback(rows);
    	});
};

// 这两个部分不知道该不该归在这里
// get private chat message
Message.prototype.getPriMsg = function(fromUser, toUser, callback){
    var query = "SELECT * FROM PriMsg WHERE fromUser=? and toUser=?";
        this.connector.db.all(query, user1, user2, function(err, rows) {

            if(err) {
            console.log(err);
            }

            callback(rows);
        });
};

// 这两个部分不知道该不该归在这里
//save private chat message
Message.prototype.savePriMsg = function(messages, timestamp, fromUser, toUser, call){
    this.connector.db.run("INSERT INTO PriMsg(message, timestamp, frmoUser, toUser) VALUES (?, ?, ?, ?)",
        messages, timestamp, user1, user2);
        call("Private Messages Saved");
};

/* 	visible if messages.js imported with require()
	call method:
	var MyMessage = require('messages.js');
*/ 
module.exports = Message;