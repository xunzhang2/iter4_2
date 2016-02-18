var express = require("express");
var app = express();
var server = app.listen(3000);
var client = require("socket.io").listen(server).sockets;

var router = express.Router();

var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var db_msg = new sqlite3.Database("messages.db");

//var whitespacePattern = /^\s*$/;
var validPattern = /[^a-zA-Z0-9_-]/;

client.on("connection", function(socket) {
    
	socket.on("initialize-login", function(data) {
	    
		    var name = data.name;
		    var password = data.password;
           
            socket.emit("login-result", {pass:true, name:data.name});               
	});
     
	socket.on("initialize-chatroom", function(data) {
		var name = data;
		if(fs.existsSync("messages.db") == false) {
			console.log("Creating DB file.");
			fs.openSync("messages.db","w");
		}
       
   
		db_msg.serialize(function() {
			db_msg.run("CREATE TABLE IF NOT EXISTS Messages (" + 
				"Timestamp TEXT NOT NULL, " + 
				"User TEXT NOT NULL, " + 
				"Message TEXT NOT NULL)");
		});

		var select_query = "SELECT * FROM Messages ORDER BY ROWID DESC LIMIT 100"
		
		var db_messages = []
		var db_users = []

		db_msg.each(select_query, function(err, row) {
			if (row !== undefined) {
				db_message = {
					name: row.User,
					timestamp: row.Timestamp,
					message: row.Message
				};

				db_messages[db_messages.length] = db_message;
			}
		},function(err, rows) { // "rows" = number of rows retrieved
			if (rows > 0) {
				socket.emit("output", db_messages);
			}
			client.emit("user_connected", name);
		});

		socket.on("input", function(data) {

			console.log(data);
			var message = data.message;
			var timestamp = data.timestamp;
			//if (whitespacePattern.test(message)) {
			//	sendStatus("Message musn't be empty.");
			//} else {
				client.emit("output", [data]); 
				sendStatus({
					message: "Message sent",
					clear: true
				});
				db_msg.serialize(function() {
					db_msg.run("INSERT INTO Messages VALUES(?, ?, ?)", 
						timestamp, name, message);
				});
			//}
		});

		
		socket.on("disconnect", function(){
			client.emit("user_disconnected", name);
			console.log(name + " disconnected");
		});

	});


});

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));