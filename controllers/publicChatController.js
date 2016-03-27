module.exports = function(app, message) {
    
    fs = require('fs');
	// db.createDB();

    // Public Chat
    app.get('/chat', function(req, res) {
	  if ('username' in req.cookies)
	        message.getMessages(function(doc){
	  			console.log(doc);
	  			res.locals.title = "Chat";
	 			res.render("chat", {result: doc});
	     });
	 else
	     res.redirect('/');
    });

}