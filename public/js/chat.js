var socket = io();

//get messages from jade, send it to server
$('form').submit(function(){
	var message = $('#messages').val();
    socket.emit('chat message',message);
	$('#messages').val('');
	return false;
});

//attach new messages on the message list
socket.on('newMsg',function(data){
	$('#messagelist').append($('<li class = "btn btn-dark btn-lg home-items">').text(data));
});
