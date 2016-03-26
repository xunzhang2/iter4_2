var socket = io();

socket.on('connect', function (data) {
    socket.emit('usersList', { name: getCookie('username') });
});

socket.emit('usersListReq');

socket.on('usersListRes', function(data){
  
}