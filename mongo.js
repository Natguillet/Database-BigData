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

  /**
   * [insertSkill description]
   * @param  {[type]} skill [description]
   * @return {[type]}       [description]
   */
  insertSkills(skills) {
    return this.getConnection()
    .then(db => db.collection('skills'))
    .then(col => col.insertMany(skills));
  }

  resetCollection(collectionName) {
    return this.getConnection()
    .then(db => db.collection(collectionName))
    .then(col => col.removeMany())
  }
  // {
  //   "name": "Acid Arrow",
  //   "level": 2,
  //   "components" : ["V", "S", "M"],
  //   "spell_resistance" : false
  // }

  getWizardSpell() {

    let map = function () {
      let spell = {};
      spell.name = this.skillName;
      spell.components = this.components;
      spell.spell_resistance = this.spell_resistance;
      let levels = this.level;
      for (var i = 0; i < levels.length; i++) {
        if(Object.keys(levels[i])[0] === 'sorcerer/wizard') {
          var vals = Object.keys(levels[i]).map(function(key) {
              return levels[i][key];
          });
          spell.level = vals[0];
      if(spell.level) emit (this.skillName, spell);
    }
  }
}

    let reduce = function (key, values) {
      return null;
    }

    this.getConnection()
    .then(db => db.collection('skills'))
    .then(col => col.mapReduce(map, reduce, {
          out : "wizard_spell"
      }));
  }

  getgoodWizardSpell() {

  let map = function () {
    let spell = {};
    /*spell.name = this.value.name;
    spell.components = this.components;
    spell.spell_resistance = this.spell_resistance;
    let levels = this.level;*/
    //emit (this.value.skillName, this.value.components);
    if(this.value.level <= 4 && this.value.components.length == 1 && this.value.components[0] == "V")
    {
    emit(this.value.name,1)
   }
}
  let reduce = function (key, values) {
    return Array.sum(values);
  }

  this.getConnection()
  .then(db => db.collection('wizard_spell'))
  .then(col => col.mapReduce(map, reduce, {
        out : "nice_spell"
    }))
}
  /**
   * [insertSkill description]
   * @param  {[type]} skill [description]
   * @return {[type]}       [description]
   */
  insertPages(pages) {
    return this.getConnection()
    .then(db => db.collection('pageRank'))
    .then(col => col.insert(pages));
  }

  mapReducer(map,reduce)
  {
    return this.getConnection()
    .then(db => db.collection('pageRank'))
    .then(col =>{
       col.mapReduce(map, reduce, {
          out : "result"
      }, function(err, docs, lastErrorObject){
            for(var y=0; y<20; y++)
            {
                console.log(y);
                console.log(this);
                mapReducer(map,reduce);
            }
        }
      );
  })
  }

  pageRank() {
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
    console.log(this);
    this.mapReducer(map,reduce);
  }
}

module.exports = Mongo;
