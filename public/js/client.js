    var getNode = function(s) {
		return document.querySelector(s);
	};
    
   
	var current_time = function() {
		var d = new Date(Date.now());
		var datestring = d.toLocaleDateString();
		var timestring = d.toLocaleTimeString();
		return datestring.concat(" ", timestring);
	};

	
	var socket = io.connect("http://127.0.0.1:3000");

    socket.on("newuser", function(data) {
    	getNode(".login-div").style.display = "none";
       	getNode(".chat-div").style.display = "none";
    });
   


   
	socket.on("login-result", function(data) {
		if(data.pass) {
       		getNode(".login-div").style.display = "none";
       		getNode(".chat-div").style.display = "block";

    		console.log("Name = " + data.name);
   	  		execute_chatroom(data.name);
		} else {
			location.reload();
		}
	});



   
    var user_name = getNode(".user-name");
    var user_password = getNode(".user-password");

    var new_user_name = getNode(".new-user-name");
    var new_user_password = getNode(".new-user-password"); 

    var signup = getNode(".signup-div");
    var login = getNode(".login_button");


    var logout = getNode(".logout_button");
    
    logout.addEventListener("click",function(event){
    	location.reload();
    });

   

    login.addEventListener("click",function(event){
    	var name = user_name.value;
    	var password = user_password.value;
    	socket.emit("initialize-login",  {name:name, password:password});
    });

    var execute_chatroom = function(name) {
		
		messages = getNode(".chat-messages");
		textarea = getNode('.chat-textarea');
		

		if(socket !== undefined) {
			socket.on("user_connected", function(data) {
				var connected_message = document.createElement('div');
				connected_message.setAttribute('class', 'chat-announcement');
				connected_message.textContent = data + " has connected.";
				var connected_timestamp = document.createElement('div');
				connected_timestamp.setAttribute('class', 'chat-announce-timestamp');
				connected_timestamp.textContent = current_time();
				messages.appendChild(connected_message);
				messages.appendChild(connected_timestamp);
				messages.scrollTop = messages.scrollHeight;
			});

			socket.on("user_disconnected", function(data) {
				var connected_message = document.createElement('div');
				connected_message.setAttribute('class', 'chat-announcement');
				connected_message.textContent = data + " has left.";
				var connected_timestamp = document.createElement('div');
				connected_timestamp.setAttribute('class', 'chat-announce-timestamp');
				connected_timestamp.textContent = current_time();
				messages.appendChild(connected_message);
				messages.appendChild(connected_timestamp);
				messages.scrollTop = messages.scrollHeight;
			});

			socket.on("output", function(data) {
				console.log(data);
				if(data.length) {
					for(var x = data.length-1; x > -1; x = x - 1) {
						var message_name = document.createElement('div');
						message_name.setAttribute('class', 'chat-message-name');
						message_name.textContent = data[x].name;
						var message_timestamp = document.createElement('div');
						message_timestamp.setAttribute('class', 'chat-message-timestamp');
						message_timestamp.textContent = data[x].timestamp;
						var message = document.createElement('div');
						message.setAttribute('class', 'chat-message');
						message.textContent = data[x].message;
						messages.appendChild(message_name);
						messages.appendChild(message_timestamp);
						messages.appendChild(message);
						messages.scrollTop = messages.scrollHeight;
					}
				}
			});
            
            
			textarea.addEventListener("keydown", function(event) {
				var self = this;

				if(event.which === 13 && event.shiftKey === false) {
					socket.emit("input", {
						name: name,
						message: self.value,
						timestamp: current_time()
					});
					event.preventDefault(); 
				}
			});

			console.log("Ok!");
			socket.emit("initialize-chatroom", name);
			chat_name = getNode(".chat-name span");
			chat_name.textContent = name;
		}
    }

//})();