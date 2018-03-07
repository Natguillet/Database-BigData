var mongo = require("mongodb");
let fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
let result = fs.readFileSync("Pagerank.json", "UTF-8");
let dbo;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("mydb");
  dbo.createCollection("PageRank", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
 dbo.collection("PageRank").insert(JSON.parse(result), function (err, docs) {
  	console.log("DB Insert Completed");
  });
