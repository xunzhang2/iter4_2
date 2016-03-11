module.exports = function(io, db) {

  io.on("connection", function(socket){

    console.log('a user connected');
//============================ PUBLIC CHAT =====================================
    // reveive new public message from user, send it to other users
    socket.on('chat message', function(data){
       io.emit("newMsg", data);
       db.saveMessages(data, current_time(),"Lily", function(done) {
    		console.log('messages saved ;)');
    		
    	});
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