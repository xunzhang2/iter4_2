var HashMap = require('hashmap');

module.exports = function(io, db) {
  var map = new HashMap();
  
  io.on("connection", function(socket){
//============================ store clients =====================================
    socket.on('usersList', function (data) {
      if(map.has(data.name)){
        var list = JSON.parse(map.get(data.name));
        list.push(socket.id);
        map.set(data.name,JSON.stringify(list));
      }else{
        var newlist = [];
        newlist.push(socket.id);
        map.set(data.name, JSON.stringify(newlist));

      }
       
       console.log("online users "+map.keys()); 

    });
//============================ send back online user list =====================================
    socket.on('usersListReq', function(){
         socket.emit('usersListRes', map.keys());
    });  
//============================ PUBLIC CHAT =====================================
    // reveive new public message from user, send it to other users
    socket.on('sendPublicMessage', function(data){
      io.emit("broadcastPublicMessage", data);
      db.saveMessages(data.message, current_time(), data.name, function(){});
    });


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
