var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("homework");
  dbo.collection("wizard_spell").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.value.name);
    db.close();
  });
});
