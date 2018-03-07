'use strict';

const co = require('co');

class Mongo {

  /**
   * [constructor description]
   * @param  {[type]} client [description]
   * @param  {[type]} uri    [description]
   * @param  {[type]} logger [description]
   * @return {[type]}        [description]
   */
  constructor(client, uri, logger=console) {
    this._client = client;
    this._config = uri;
    this._logger = logger;

    //console.log(this);
    if(this._client) this._db = this._init(uri);
  }

  /**
   * Init the connection with MongoDB
   *
   * @param  {string} uri URI of the Mongo instance
   * @return {Promise}
   */
  _init(uri) {
    return this._client.connect(uri)
    .then(connec => {this._logger.info("Connected correctly to the MongoDB server"); return connec.db("homework");})
    .catch(err => this._logger.error(err));
  }

  /**
   * Get the mongo connection
   *
   * @return {Promise}
   */
  getConnection() {
    return this._db;
  }

let result = fs.readFileSync("PageRank.json", "UTF-8");

let mapper = function(){
    let url = this._id;
    let outlink_list = this.value.outlink_list;
    let pagerank = this.value.pagerank;
    emit(url, outlink_list);
    emit(url, outlink_list);
    outlink_list.forEach(outlink => {
        emit(outlink, pagerank/outlink_list.length);
    });
}

let reducer = function(url, list_pr_or_urls){
    let outlink_list = [];
    let pagerank = 0;

    list_pr_or_urls.forEach(pr_or_urls => {
        if(Array.isArray(pr_or_urls)){
            outlink_list = pr_or_urls;
        }
        else{
            pagerank = pagerank + pr_or_urls;
        }
    });

    pagerank = 1 - 0.85 + ( 0.85 * pagerank);
    return({"outlink_list":outlink_list,"pagerank":pagerank});
}

this.getConnection()
.then(db => db.collection('pageRank'))
.then(col => col.mapReduce(mapper, reducer, {
      out : "pagerank"
  }))
