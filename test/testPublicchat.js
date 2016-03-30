var expect = require('expect.js');
var DB = require('../database.js');

suite('Public Chat',function(){
    var db = new DB("test.db");
    db.createDB("test.db");
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
});