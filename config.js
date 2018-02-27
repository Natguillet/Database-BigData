'use strict';
//==================================================
// Config Main File
//==================================================
let apiKeys = null;

if(process.env.NODE_ENV === "production") {
  apiKeys = {
    MONGO_URI: process.env.MONGO_URI
  }
} else {
  // For local environment
  apiKeys = require('./.config');
}

// Export both objects
module.exports = Object.assign({}, apiKeys);
