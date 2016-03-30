var expect = require('expect.js');
var DB = require('../database.js');

suite('Set Status',function(){
    var db = new DB("test.db");
    db.createDB("test.db");
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
});