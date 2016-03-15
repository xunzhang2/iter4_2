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

    console.log('a user connected');

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

       console.log('user disconnected: ');
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
