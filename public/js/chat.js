var socket = io();
socket.on('connect', function () {
    
     socket.emit("join",  {name:"meng", password:"1234"});
  
});
//socket.emit("join",  {name:"meng", password:"1234"});
//var client = io();
/*
      $('form').submit(function(){
		var message = $('#messages').val();
        client.emit('chat message',message);
	    $('#messages').val('');
	    return false;
      });
	
	  client.on('connect',function(){
	  	data = "meng";
		client.emit('join',data);
	  });
	//Notify the server that there is a new message
      client.on('chat message', function(msg){
    	$('#messages').append($('<a>').text(msg));
      });*/