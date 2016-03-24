var HashMap = require('hashmap');
module.exports = function(io, db) {

  var map = new HashMap();
  io.on("connection", function(socket){
    console.log('a user connected');
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
  
       var test = map.get("meng1");
       console.log("for test: "+ test);
       
       console.log("online users "+map.keys()); 

    });

    socket.on('usersListReq', function(){
         socket.emit('usersListRes', map.keys());
    });

    
//============================ PUBLIC CHAT =====================================
    // reveive new public message from user, send it to other users
    socket.on('sendPublicMessage', function(data){
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

    socket.on('disconnect', function(){
       deleteID(socket.id);
       console.log('user disconnected');
    });

 });

 //delete offline users
    var deleteID = function(id) {
      map.forEach(function(value, key) {
          if (value.includes(id)) {
            console.log("test includs: " + key);
            var newvalue = value.replace(id, '');
            map.set(key,newvalue);
            if(!newvalue.match(/[a-z]/i)){
        //      offlineusers.push(key);
              map.remove(key);
            }
          }
      });
    }

//returns current time
  var current_time = function() {
    var d = new Date(Date.now());
    var datestring = d.toLocaleDateString();
    var timestring = d.toLocaleTimeString();
    return datestring.concat(" ", timestring);
  };
};
