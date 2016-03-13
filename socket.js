module.exports = function(io, db) {
var socketQueue = [];

  io.on("connection", function(socket){
    
//============================ PUBLIC CHAT =====================================
    // reveive new public message from user, send it to other users
    socket.on('sendPublicMessage', function(data){
      io.emit("broadcastPublicMessage", data);
      db.saveMessages(data.message, current_time(), data.name, function(){});
    });
//============================ PUBLIC CHAT =====================================

//============================ ANNOUNCEMENT =====================================
    socket.on('disconnect', function(){
       console.log('user disconnected');
    });

  });


  //returns current time
	var current_time = function() {
		var d = new Date(Date.now());
		var datestring = d.toLocaleDateString();
		var timestring = d.toLocaleTimeString();
		return datestring.concat(" ", timestring);
	};
};