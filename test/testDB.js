var expect = require('expect.js');
var DB = require('../database.js');

suite('Database Test',function(){
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
//====================================  TEST PRIVATE CHAT  ================================= 
    test('Test saving private messeges ', function(done){
      function callback(result) {
          expect(result).to.equal("Success");
          done();
      }
      db.savePriMsg("Alien!","2200","meng","meng1",callback)
    });

    test('Test getting private messeges ', function(done){
      function callback(result) {
        expect(result[0]["message"]).to.equal("Alien!");
        done();
      }
      db.getPriMsg("meng","meng1",callback)
    });
//====================================  TEST PUBLIC CHAT  =================================    
    test('Tests saving public messages', function(done){
      function callback(result) {
        expect(result).to.equal("Messages Saved");
        done();
      }
      db.saveMessages("Hi there", "2016","admin", callback)
    });

    test('Tests getting public messages', function(done){
      function callback(result) {
        expect(result[0]["message"]).to.equal('Hi there');
        done();
      }
      db.getMessages(callback)
    });
//====================================  TEST ANNOUNCEMENTS  =================================    
    test('Tests saving announcement', function(done){
      function callback(result) {
        expect(result).to.equal("Annoucement Saved");
        done();
      }
      db.saveAnnouce("Careful!", "2016","admin", callback)
    });

    test('Tests getting announcement', function(done){
      function callback(result) {
        expect(result[0]["message"]).to.equal("Careful!");
        done();
      }
      db.getAnnouce(callback)
    });
//====================================  TEST USER STATUS  ================================= 
   test('Test setting status', function(done){
      function callback(result) {
        expect(result).to.equal("Success");
        done();
      }
      db.setStatus("meng","Help",callback)
    });  

    test('Test getting status', function(done){
      function callback(result) {
        expect(result[0]["status"]).to.equal("Help");
        done();
      }
      db.getUsers(callback)
    })
//===================================  TEST SEARCH FUNCTION   ===============================
  suite('Search function', function(){
    test('Test searching users', function(done){
      function callback(result) {
        expect(result[0]["username"]).to.equal("meng");
        done();
      }
      db.searchUsers(["meng"],callback)
    });  

    test('Test searching status', function(done){
      function callback(result) {
        expect(result[0]["username"]).to.equal("meng");
        done();
      }
       db.searchStatus("Help",callback)
    })

    test('Test searching annoucements', function(done){
      function callback(result) {
        expect(result[0]["message"]).to.equal("Careful!");
        done();
      }
      db.searchAnnouncements([ 'l', '', '' ],callback)
    });  

    test('Test searching public messages', function(done){
      function callback(result) {
        expect(result[0]["message"]).to.equal('Hi there');
        expect(result[0]["username"]).to.equal('admin');
        done();
      }
      db.searchPublic([ 'l', '', '' ],callback)
    })

    test('Test searching private messages', function(done){
      function callback(result) {
        expect(result[0]["message"]).to.equal("Alien!");
        done();
      }
      db.searchPrivate([ 'l', '', '' ],"meng","meng1",callback)
    })
  });
  	 
});
