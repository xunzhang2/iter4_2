module.exports = function(app, db) {
    
    fs = require('fs');
//    db.createDB();

    // Set Status
    app.get('/status', function(req, res) {
		if ('username' in req.cookies) {
		    res.locals.title = "Status";
		    res.render('status');
		} else {
		    res.redirect('/');
		}
    });
    
    // Post Status
    app.post('/status', function(req, res) {
		console.log(req.body);
		console.log(req.cookies['username']);
		var status = req.body.status;
		
		// call back
		function callback(result) {
		    if (result == "Success") {
				req.session.message = "Successfully set status: " + status;
				res.redirect('/home');
		    } else {
				res.locals.failure = true;
				res.locals.message = "Error";
				res.render('status');
		    }
		}

		console.log("post status");
		console.log(status);
		db.setStatus(req.cookies['username'], status, callback);
    });

}