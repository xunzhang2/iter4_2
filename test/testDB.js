var expect = require('expect.js');
var DB = require('../database.js');

suite('Database Test',function(){

  	test('Test new user', function(done){
      var newDB = new DB();
      function callback(result) {
        expect(result).to.equal("User does not exist");
        done();
      }
      newDB.userExists("meng2","1234",callback)
    });

    test('Test existed user, password correct', function(done){
    	var newDB = new DB();
      function callback(result) {
        expect(result).to.equal("Success");
        done();
      }
      newDB.userExists("meng","1234",callback)
    });

    test('Test existed user, password not correct', function(done){
      var newDB = new DB();
      function callback(result) {
        expect(result).to.equal("Password Incorrect");
        done();
      }
      newDB.userExists("meng","12345",callback)
    });

    test('Test saving private messeges ', function(done){
      var newDB = new DB();
      function callback(result) {
        expect(result).to.be.an('array');
        done();
      }
      newDB.getPriMsg("meng","meng1",callback)
    });

    test('Tests saving announcement', function(done){
      var newDB = new DB();
      function callback(result) {
        expect(result).to.be.an('array');
        done();
      }
      newDB.getAnnouce(callback)
    });

    test('Test setting status', function(done){
      var newDB = new DB();
      function callback(result) {
        expect(result).to.equal("Success");
        done();
      }
      newDB.setStatus("Help","meng",callback)
    });
  
  	 
});