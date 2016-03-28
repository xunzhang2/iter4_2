var expect = require('expect.js');
var DB = require('../database.js');

suite('Search Infomation',function(){
    var db = new DB("test.db");
    db.createDB("test.db");
    test('Test searching users', function(done){
    function callback(result) {
              expect(result[0]["username"]).to.equal("meng");
              done();
    }
    db.searchUsers(["meng"],callback)
      });  

      test('Test fail searching users', function(done){
    function callback(result) {
              expect(result.length).to.equal(0);
              done();
    }
    db.searchUsers(["duck"],callback)
      });  
      
      test('Test searching status', function(done){
    function callback(result) {
              expect(result[0]["username"]).to.equal("meng");
              done();
    }
    db.searchStatus("Help",callback)
      })

      test('Test fail searching status', function(done){
    function callback(result) {
        expect(result.length).to.equal(0);
              done();
    }
    db.searchStatus("OK",callback)
      })
      
      
      test('Test searching annoucements', function(done){
    function callback(result) {
              expect(result[0]["message"]).to.equal("Careful!");
              done();
    }
    db.searchAnnouncements([ 'ful!' ],callback)
      });  

      test('Test fail searching annoucements', function(done){
    function callback(result) {
        expect(result.length).to.equal(0);
              done();
    }
    db.searchAnnouncements([ 'zz' ],callback)
      });  
      
      test('Test searching public messages', function(done){
    function callback(result) {
              expect(result[0]["message"]).to.equal('Hi there');
              expect(result[0]["username"]).to.equal('admin');
              done();
    }
    db.searchPublic([ 'ere' ],callback)
      });
      
      test('Test fail searching public messages', function(done){
    function callback(result) {
        expect(result.length).to.equal(0);
              done();
    }
    db.searchPublic([ 'zz' ],callback)
      });
      
      
      test('Test searching private messages', function(done){
    function callback(result) {
              expect(result[0]["message"]).to.equal("Alien!");
              done();
    }
    db.searchPrivate([ 'l', '', '' ],"meng","meng1",callback)
      });

      test('Test fail searching private messages', function(done){
    function callback(result) {
        expect(result.length).to.equal(0);
              done();
    }
    db.searchPrivate([ 'zz' ],"meng", "meng1", callback)
      });

  
});