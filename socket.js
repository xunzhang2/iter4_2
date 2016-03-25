module.exports = function(io, db) {
  // console.log("initial: isMeasuringPerformance=" + isMeasuringPerformance);
// var file=require('./routes.js');
// var flag=file.flag;
// console.log("flag="+flag);

  io.on("connection", function(socket){

//============================ PUBLIC CHAT =====================================
    // reveive new public message from user, send it to other users
    socket.on('sendPublicMessage', function(data){
      // console.log("sendpublicmessage: isMeasuringPerformance=" + isMeasuringPerformance);
      // console.log("flag inside="+flag);
      io.emit("broadcastPublicMessage", data);
      db.saveMessages(data.message, current_time(), data.name, function(){});
      
    });

//============================ PRIVATE CHAT =====================================

    socket.on("joinRoom",function(data){
      socket.join(data.room);
    });


    socket.on('sendPrivateMessage', function(data){
      console.log("~~receiver "+data.receiver);
      var roomname=data.sender<data.receiver?data.sender.concat(data.receiver):data.receiver.concat(data.sender);
      console.log(roomname);
      socket.broadcast.to(roomname).emit("broadcastPrivateMessage", data);
      db.savePriMsg(data.message, current_time(), data.sender, data.receiver, function(){});
    });

   
//============================ ANNOUNCEMENT =====================================
 // reveive announcements from user
    socket.on('announcement', function(data){
      io.emit("newAnn", {msg: data.msg, time: current_time(), name:data.name});
      db.saveAnnouce(data.msg, current_time(), data.name, function() {});
    });
  //============================ DISCONNECT =====================================   

    socket.on('disconnect', function(){});


  });




//returns current time
  var current_time = function() {
    var d = new Date(Date.now());
    var datestring = d.toLocaleDateString();
    var timestring = d.toLocaleTimeString();
    return datestring.concat(" ", timestring);
  }; 


};