var expect = require('expect.js');
var agent = require('superagent');

var PORT = process.env.PORT | 3000;
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
    username: 'test' + Math.random(),
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
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      done();
    });
  });
  });
  
 
  
  suite('Public chat API', function(){

    test('Saving public messages', function(done){
      agent.post(HOST+'/api/messages/public')
      .send({
          username: user.username,
          timestamp: "2022",
          message: "hiya"
       })
      .end(function(err, res){
        expect(res).to.have.property('statusCode');
        expect(res).to.have.property('body');
        expect(res.status).to.equal(201);
        done();
     });
    });

    test('Getting public messages', function(done){
      agent.get(HOST+'/api/messages/public')
      .end(function(err, res){
        expect(res).to.have.property('statusCode');
        expect(res).to.have.property('body');
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
     });
    });

  });
  

});
