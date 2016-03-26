var socket = io();
var onlineuser = [];
var offlineuser = [];
var alluser = [];
socket.on('connect', function (data) {
   socket.emit('usersList', { name: getCookie('username') });   
});

socket.emit('usersListReq');

socket.on('alllUsers', function(result){
  for(x in result){
  	if(result[x].onoff == "online")
	   $('#onlineusers').append('<a href="/privatechat?receiver="'+ result[x].username +'><b style="float:left;font-size:200%; "'+'>' 
	   	+ result[x].username + '</b><b style="float:center;font-size:200%;">' + result[x].status 
	   	+ '</b><b style="float:right;font-size:200%;">' + result[x].onoff + '</b><hr/>');
    else
       $('#offlineusers').append('<a href="/privatechat?receiver="'+ result[x].username +'><b style="float:left;font-size:200%;">' 
       	+ result[x].username + '</b><b style="float:center;font-size:200%;">' + result[x].status 
       	+ '</b><b style="float:right;font-size:200%;">' + result[x].onoff + '</b><hr/>');	

  }	
  
});





