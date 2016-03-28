var expect = require('expect.js');
var DB = require('../database.js');

suite('Private Chat',function(){
    var db = new DB("test.db");
    db.createDB("test.db");
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
});