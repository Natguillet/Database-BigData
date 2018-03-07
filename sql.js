'use strict';
const dxContent = require('./dxContent');
const co = require('co');
const Mongo = require('./mongo');
const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(function (){

db.run("CREATE TABLE NAMESKILL (name varchar(30), class varchar(30) , level varchar(10), components varchar(10))");


co(function* (){
   let skills = [];
   var stmt = db.prepare ("INSERT INTO NAMESKILL (name,class,level,components) VALUES (?,?,?,?)")
   for (var i = 1; i < 10; i++) {
      yield dxContent(i)
       .then(skill => {
         skills.push(skill);
         let levels = skill.level;
         let components = skill.components;
         console.log(components);
         for(var i=0;i<levels.length;i++)
         {
          // console.log(Object.keys(levels[i])[0]);
           if(Object.keys(levels[i])[0] == 'sorcerer/wizard')
           {
           stmt.run (skill.skillName,Object.keys(levels[i])[0],Object.values(levels[i])[0],components]);
           }
         }
         //console.log(skill.skillName);
         //stmt.run (skill.skillName,skill.school,Object.keys(skill.level[0])[0]);
       })
  }
  stmt.finalize();
  return skills
}).then(skills => {
   db.each("SELECT rowid AS id , name, class, level, components FROM NAMESKILL", function(err,row) {
     console.log(row.id + ":" + row.name + " " + " " + row.class + " " + row.level + " " + row.components);
   })
});

})
//mongo.freePito();
// .then(result => console.log(result));

/*db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});*/
