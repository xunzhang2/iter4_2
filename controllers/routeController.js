module.exports = function(app, db) {
    
    fs = require('fs');
	// db.createDB();
	
    // returns current time
	var current_time = function() {
		var d = new Date(Date.now());
		var datestring = d.toLocaleDateString();
		var timestring = d.toLocaleTimeString();
		return datestring.concat(" ", timestring);
	};
};
		
