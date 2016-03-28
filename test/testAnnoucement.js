var expect = require('expect.js');
var DB = require('../database.js');

suite('Annoucement',function(){
    var db = new DB("test.db");
    db.createDB("test.db");
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
});