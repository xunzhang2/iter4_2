var socket = io();

//get messages from jade, send it to server
$('form').submit(function(){
		$.ajax({
      url:  '/isbusy',
      type: 'GET',
      async: false,
      cache: false,
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
		console.log("data="+data.start);
		if(data.start)
			// document.write("~overwrite");
			window.location.href='/announce'; // purpose: to render busy.jade
		}
    });
		
	var message = $('#messages').val();
    socket.emit('announcement',{msg: message, name: getCookie('username')});
	$('#messages').val('');
	return false;
});

//attach new messages on the message list
socket.on('newAnn',function(data){
	$('#messagelist').append($('<li class = "btn btn-dark btn-lg home-items">').text(data.name));
	$('#messagelist').append($('<li class = "btn btn-dark btn-lg home-items">').text(data.msg));
	$('#messagelist').append($('<li class = "btn btn-dark btn-lg home-items">').text(data.time));
});
