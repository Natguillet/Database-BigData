'use strict';
const Mongo = require('./../mongo');
const fs = require('fs');
const pageRank = require('./pageRank');

/* Load DB clients */
const MongoClient = require('mongodb').MongoClient;

/* Load env variables */
const {
  MONGO_URI
} = require('./../config');

const mongo = new Mongo(MongoClient, MONGO_URI);
let result = fs.readFileSync("Pagerank.json", "UTF-8");
let y=0;
let collectionName = 'pageRank';

mongo.resetCollection('pageRank');
mongo.insertPages(JSON.parse(result));
//.then(() => mongo.pageRank());

  let map = function(){
      let url = this._id;
      let outlink_list = this.value.outlink_list;
      let pagerank = this.value.pagerank;
      for (var i=0; i<outlink_list.length;i++)
      {
      var link = outlink_list[i];
      emit(link, pagerank/outlink_list.length);
    }
      emit(url, 0);
      emit(url, outlink_list);
    }

  let reduce = function(url, list){
      let outlink_list = [];
      let pagerank = 0;

      list.forEach(adjlist => {
          if(Array.isArray(adjlist)){
              outlink_list = adjlist;
          }
          else{
              pagerank = pagerank + adjlist;
          }
      });
      pagerank = 1 - 0.85 + ( 0.85 * pagerank);
      return({"outlink_list":outlink_list,"pagerank":pagerank});
  }

  let mapReducer = function(collectionName)
  {
    return mongo.getConnection()
    .then(db => db.collection(collectionName))
    .then(col =>{
       col.mapReduce(map, reduce, {
          out : "result"
      }, function(err, docs, lastErrorObject){
            if (y<20)
            {
                collectionName = 'result';
			          console.log("\nInteration : " + y);
                mapReducer(collectionName);
                y++;
            }
        }
      );
  })
  }

mapReducer(collectionName);
