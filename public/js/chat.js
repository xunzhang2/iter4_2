socket = io();
username=getCookie('username');

//attach new messages on message list
socket.on('broadcastPublicMessage',function(data){
	var message = data.message;
    var name = data.name;  // do not mix with username here!!
    var date=new Date();
    var time=date.getHours()+':'+date.getMinutes();
    $('#messages').prepend('<b style=\'float:left\'>' + name + '</b><b style=\'float:right\'>' + time + '</b><br />' + message + '<hr />');
});

// when there is new private msg, alert
socket.on('broadcastPrivateMessage',function(data){
	var sender=data.sender;
	var receiver=data.receiver;
	if(receiver==username){
		$('#newmessagenotification').html("A new message from "+ sender);
		$('#newmessagenotification').attr("href","/privatechat?receiver=" + sender); 
	}
	else{
		console.log("oops!!!!you are not the target.");
		console.log("receiver=%s, username=%s",receiver,username);
	}
});

//get messages from jade, send it to server
function sendpublicmessage(){
	var message = $('#outgoingMessage').val();
    socket.emit('sendPublicMessage',{message:message, name:username});
	$('#outgoingMessage').val('');
}

