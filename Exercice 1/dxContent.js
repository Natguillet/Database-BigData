'use strict';

// Import the dependencies
const cheerio = require("cheerio"),
      req = require("tinyreq");

// Define the scrape function
module.exports = (index) => {
  return new Promise(function(resolve, reject) {
    let url = "http://www.dxcontent.com/SDB_SpellBlock.asp?SDBID=" + index;
    console.log(url);

    // 1. Create the request
    req(url, (err, body) => {
        if (err) { return reject(err); }

        // 2. Parse the HTML
        let $ = cheerio.load(body), pageData = {};

        // 3. Extract the data
        pageData['skillName'] = $('.heading').text();
        $('.SPDet').map(function(i, el) {
          // this === el
          $(this).find('b').map(function(i, el){

            let key = $(this).text().replace(/ /g, "_").toLowerCase();
            let a = $(this);
            let b = $(this).parent().contents();
            let value = $(b[Array.prototype.findIndex.call(b, function(elem){return $(elem).is(a);})+1]).text();

            if(key === 'level') {
              value = value.split(', ')
              .filter(str => str.match(/\d/g) != null)
              .map(str => {
                let level = str.match(/\d/g)[0];
                let characterClass = str.replace(/[\d\s]/g, "").trim();
                return str = {
                  [characterClass] : level,
                };
              });
            }
            else if(key === 'components') {
              value = value.split(', ').map(str => str.replace(/[^A-Z]/g, ""));
            }
            else if(key === 'spell_resistance') {
              if(value.trim() === 'yes') value = true;
              else value = false;
            }
            else value = value.trim();

            pageData[key] = value;
          });
        });
        pageData['description'] = $('.SPDesc').text();
        // Send the data in the callback
        resolve(pageData);
    });
  })
}
