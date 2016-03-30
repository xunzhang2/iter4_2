var expect = require('expect.js');
var DB = require('../database.js');

suite('Join community',function(){
    var db = new DB("test.db");
    db.createDB("test.db");
//====================================  TEST USER VALIDATION  ================================= 
  	test('Test new user', function(done){
      function callback(result) {
        expect(result).to.equal("User does not exist");
        done();
      }
      db.userExists("meng2","1234",callback)
    });


    test('Test adding user', function(done){
      function callback(result) {
        expect(result).to.equal("User created");
        done();
      }
      db.addUser("meng","1234",callback)
    });


    test('Test existed user, password correct', function(done){
      function callback(result) {
        expect(result).to.equal("Success");
        done();
      }
      db.userExists("meng","1234",callback)
    });

    test('Test existed user, password not correct', function(done){
      function callback(result) {
        expect(result).to.equal("Password Incorrect");
        done();
      }
      db.userExists("meng","12345",callback)
    });
});

