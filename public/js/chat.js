
socket = io();
username=getCookie('username');

//attach new messages on message list
socket.on('broadcastPublicMessage',function(data){
	console.log("==="+data);
	var message = data.message;
    var name = data.name;  // do not mix with username here!!
    var date=new Date();
    var time=date.getHours()+':'+date.getMinutes();
    $('#messages').prepend('<b style=\'float:left\'>' + name + '</b><b style=\'float:right\'>' + time + '</b><br />' + message + '<hr />');
});


//get messages from jade, send it to server
function sendpublicmessage(){
	var message = $('#outgoingMessage').val();
    socket.emit('sendPublicMessage',{message:message, name:username});
	$('#outgoingMessage').val('');
}

