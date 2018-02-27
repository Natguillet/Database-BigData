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
        }
      }
      if(spell.level) emit (this.skillName, spell);
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
}

module.exports = Mongo;
