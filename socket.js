module.exports = function(io, db) {

  io.on("connection", function(socket){

    console.log('a user connected');
//============================ PUBLIC CHAT =====================================
    // reveive new public message from user, send it to other users
    socket.on('chat message', function(data){
       io.emit("newMsg", {msg: data.msg, time: current_time(), name:data.name});
       db.saveMessages(data.msg, current_time(),data.name, function(done) {
        console.log('messages saved ;)');
        
      });
    });
 //============================ PRIVATE CHAT =====================================

//============================ ANNOUNCEMENT =====================================
 // reveive announcements from user
    socket.on('announcement', function(data){
       io.emit("newAnn", {msg: data.msg, time: current_time(), name:data.name});
       db.saveAnnouce(data.msg,  current_time(),data.name, function(done) {
        console.log('annoucement saved ;)');
        
      });
    });
  //============================ DISCONNECT =====================================   

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
