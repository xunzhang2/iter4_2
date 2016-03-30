var expect = require('expect.js');
var agent = require('superagent');

var PORT = process.env.PORT | 8000;
var HOST = 'http://localhost:'+PORT;

// Initiate Server
var debug = require('debug')('Node-API-Testing');
var app = require('../server');

app.set('port', PORT);
app.set('testing', true);

var serverInitialized = function() {
  debug('Express server listening on port ' + PORT);
};

var server = app.listen(app.get('port'), serverInitialized)
.on('error', function(err){
  if(err.code === 'EADDRINUSE'){
    PORT++;
    HOST = 'http://localhost:'+PORT;
    app.set('port', PORT);
    server = app.listen(app.get('port'), serverInitialized)
  }
});

var user = {
    username: 'test1' + Math.random(),
    password: '1234'
};

var user2 = {
    username: 'test2' + Math.random(),
    password: '1234'
};

suite('Rest API test', function(){
    
    suite('User API', function(){
	test('Creating a new user', function(done){
	    agent.post(HOST+'/api/users')
		.send(user)
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.status).to.equal(201);
		    done();
		});
	});

	test('Creating another new user', function(done){
	    agent.post(HOST+'/api/users')
		.send(user2)
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.status).to.equal(201);
		    done();
		});
	});

	
	test('Validating existed user (password correct)', function(done){
	    agent.post(HOST+'/api/users')
		.send(user)
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.status).to.equal(200);
		    done();
		});
	});

	test('Try a banned username', function(done){
	    agent.post(HOST+'/api/users')
		.send({
		    username: 'admin', 
		    password: 'whatever'
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(400);
		    done();
		});
	});

	test('Validating existed user (password not correct)', function(done){
	    agent.post(HOST+'/api/users')
		.send({
		    username: user.username,
		    password: '12345'
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.status).to.equal(400);
		    done();
		});
	});

	
	test('Getting all users', function(done){
	    agent.get(HOST+'/api/users')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});
    });
        
    suite('Status API', function(){	
	test('setting user status', function(done){
	    agent.post(HOST+'/api/users/' + user.username + '/setstatus/' + 'OK')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.statusCode).to.equal(201);
		    done();
		});
	});	

	test('setting another user status', function(done){
	    agent.post(HOST+'/api/users/' + user.username + '/setstatus/' + 'Emergency')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.statusCode).to.equal(201);
		    done();
		});
	});	
	 
	test('setting invalid status', function(done){
	    agent.post(HOST+'/api/users/' + user.username + '/setstatus/' + 'dead')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.statusCode).to.equal(400);
		    done();
		});
	});		

	test('setting DNE status', function(done){
	    agent.post(HOST+'/api/users/whoisthis/setstatus/' + 'OK')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.statusCode).to.equal(404);
		    done();
		});
	});		
    });
    


    suite('Public chat API', function(){	
	test('Saving public messages', function(done){
	    agent.post(HOST+'/api/messages/public')
		.send({
		    username: user.username,
		    timestamp: "1",
		    message: "hi"
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.status).to.equal(201);
		    done();
		});
	});

	test('Saving DNE public messages', function(done){
	    agent.post(HOST+'/api/messages/public')
		.send({
		    username: "who dis",
		    timestamp: "1",
		    message: "hi"
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(404);
		    done();
		});
	});

	test('Getting public messages', function(done){
	    agent.get(HOST+'/api/messages/public')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	 

	test('Getting someones messages', function(done){
	    agent.get(HOST+'/api/messages/public/' + user.username)
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	

	test('Getting nobodys messages', function(done){
	    agent.get(HOST+'/api/messages/public/whodis')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(404);
		    done();
		});
	});	
    });
  


    suite('Private chat API', function(){	
	test('Saving private messages', function(done){
	    agent.post(HOST+'/api/messages/private')
		.send({
		    sender: user.username,
		    target: user2.username,
		    timestamp: "1",
		    message: "private chat"
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(201);
		    done();
		});
	});

	test('Saving reciprocate private messages', function(done){
	    agent.post(HOST+'/api/messages/private')
		.send({
		    sender: user2.username,
		    target: user.username,
		    timestamp: "2",
		    message: "a reply"
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(201);
		    done();
		});
	});

	test('Saving sender wrong private messages', function(done){
	    agent.post(HOST+'/api/messages/private')
		.send({
		    sender: "who?",
		    target: user2.username,
		    timestamp: "1",
		    message: "hi"
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(404);
		    done();
		});
	});
	
	test('Saving target wrong private messages', function(done){
	    agent.post(HOST+'/api/messages/private')
		.send({
		    sender: user.username,
		    target: "lol",
		    timestamp: "1",
		    message: "hi"
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(404);
		    done();
		});
	});

	test('Get private messages', function(done){
	    agent.get(HOST+'/api/messages/private/' + user.username + '/' + user2.username)
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});

	test('Get DNE user1 private messages', function(done){
	    agent.get(HOST+'/api/messages/private/whoisthis/' + user2.username)
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(404);
		    done();
		});
	});

	test('Get DNE user2 private messages', function(done){
	    agent.get(HOST+'/api/messages/private/' + user2.username + '/someone')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(404);
		    done();
		});
	});

	test('Get private convos', function(done){
	    agent.get(HOST+'/api/users/' + user.username + '/private')
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});

	test('Get DNE private convo', function(done){
	    agent.get(HOST+'/api/users/someone/private')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.status).to.equal(404);
		    done();
		});
	});
    });
    

    suite('Announcements API', function(){	
	test('post announcement', function(done){
	    agent.post(HOST+'/api/messages/announcements')
	    	.send({
		    timestamp: "4:20",
		    message: "this is an announcement"
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(201);
		    done();
		});
	});	

	test('get announcement', function(done){
	    agent.get(HOST+'/api/messages/announcements')
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	
    });


    
    suite('Search User API', function(){	
	test('search existing users', function(done){
	    agent.post(HOST+'/api/users/search')
	    	.send({
		    usernames: ['test']
		})
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	

	test('search DNE users', function(done){
	    agent.post(HOST+'/api/users/search')
	    	.send({
		    usernames: ['z']
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(404);
		    done();
		});
	});	
    });

    suite('Search Status API', function(){	
	test('search existing status', function(done){
	    agent.post(HOST+'/api/users/search/status/Emergency')
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	

	test('search invalid status', function(done){
	    agent.post(HOST+'/api/users/search/status/heaven')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(400);
		    done();
		});
	});	

	test('search no one status', function(done){
	    agent.post(HOST+'/api/users/search/status/Help')
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(404);
		    done();
		});
	});	
    });


    suite('Search Announcements API', function(){	
	test('search valid announcements', function(done){
	    agent.post(HOST+'/api/messages/announcements/search')
	    	.send({
		    keywords: ['announcement']
		})
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	
	
	test('search no result announcements', function(done){
	    agent.post(HOST+'/api/messages/announcements/search')
	    	.send({
		    keywords: ['zzrot']
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(404);
		    done();
		});
	});	
    });

    
    suite('Search Public API', function(){	
	test('search valid public', function(done){
	    agent.post(HOST+'/api/messages/public/search')
	    	.send({
		    keywords: ['hi']
		})
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	
	
	test('search no result public', function(done){
	    agent.post(HOST+'/api/messages/public/search')
	    	.send({
		    keywords: ['zzz']
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(404);
		    done();
		});
	});	
    });

    
    suite('Search Private API', function(){	
	test('search valid private', function(done){
	    agent.post(HOST+'/api/messages/private/'+user.username+'/'+user2.username+'/search')
		.send({
		    keywords: ['private']
		})
		.end(function(err, res){
		    expect(res).to.have.property('body');
		    expect(res.body).to.be.an('array');
		    done();
		});
	});	
	
	test('search invalid first private', function(done){
	    agent.post(HOST+'/api/messages/private/dne/'+user2.username+'/search')
	    	    .send({
			keywords: ['however']
		    })
		    .end(function(err, res){
			expect(res).to.have.property('statusCode');
			expect(res.statusCode).to.equal(404);
			done();
		    });
	    });	
	});

	test('search invalid second private', function(done){
	    agent.post(HOST+'/api/messages/private/'+user.username+'/dne/search')
		.send({
		    keywords: ['however']
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(404);
		    done();
		});
	});	
	
	test('search no result private', function(done){
	    agent.post(HOST+'/api/messages/private/'+user.username+'/'+user2.username+'/search')
		.send({
		    keywords: ['']
		})
		.end(function(err, res){
		    expect(res).to.have.property('statusCode');
		    expect(res.statusCode).to.equal(404);
		    done();
		});
	});
});
