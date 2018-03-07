'use strict';
const Mongo = require('./mongo');
const dxContent = require('./dxContent');
const co = require('co');

/* Load DB clients */
const MongoClient = require('mongodb').MongoClient;

/* Load env variables */
const {
  MONGO_URI
} = require('./../config');

const mongo = new Mongo(MongoClient, MONGO_URI);

// ------ SCRAP ALL SPELLS IN DxContent --------
// reset the docuement if exist
mongo.resetCollection("skills");
 co(function* (){
   let skills = [];
   for (var i = 1; i < 1976; i++) {
     if (i != 1972 && i != 1841) {
       yield dxContent(i)
       .then(skill => skills.push(skill));
     }
   }
   yield mongo.insertSkills(skills);
   // ------ DO MAPREDUCE FOR HAVE JUST WIZARD SPELL ---------
   yield mongo.resetCollection('wizard_spell');
   yield mongo.getWizardSpell();
   // ----- DO MAPREDUCE FOR FREE PITO ------
   // The spell should be a wizard spell and no verbal and
   // the max level is 4
   yield mongo.resetCollection('nice_spell');
   yield mongo.getgoodWizardSpell();
});
