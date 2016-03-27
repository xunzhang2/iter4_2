module.exports = function(app, announcement) {
    
    fs = require('fs');
	//announcement.createDB();
	    
    // Annonucement
	app.get('/announce', function(req, res) {
		if ('username' in req.cookies)
			announcement.getAnnouce(function(doc){
				console.log(doc);
				res.locals.title = "Post Announcement";
				res.render("announce", {result: doc});
			});
		else
			res.redirect('/');
	});

}