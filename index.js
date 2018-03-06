'use strict';
const Mongo = require('./mongo');
const dxContent = require('./dxContent');
const co = require('co');

/* Load DB clients */
const MongoClient = require('mongodb').MongoClient;

/* Load env variables */
const {
  MONGO_URI
} = require('./config');

const mongo = new Mongo(MongoClient, MONGO_URI);

mongo.resetCollection('nice_spell');
mongo.getgoodWizardSpell();
// ------ SCRAP ALL SPELLS IN DxContent --------
//mongo.resetCollection("wizard_spell");
 /*co(function* (){
   let skills = [];
  for (var i = 1; i < 1976; i++) {
      yield dxContent(i)
      .then(skill => skills.push(skill));
   }
   return skills
}).then(skills => mongo.insertSkills(skills));*/

//mongo.getWizardSpell();
 //.then(result => console.log(result));
