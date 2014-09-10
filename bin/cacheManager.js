'use strict';

// Dependencies
var moment = require('moment'),
    config = require('./config');

// Configuration properties
var cacheCollection = config.cache.collection || 'fl_api_cache',
    cacheLifetime = config.cache.lifetime || 300000; // 5 minutes (in milliseconds 5*60*1000)

// Cache manager (cache db is required)
exports = module.exports = function(db) {
  return {
    // Gets item from cache by passed key
    checkCache: function(key, callback) {
      // key should be string
      if ('string' !== typeof key) return null;

      var expirationTime = moment.utc().toISOString();

      // Cached item is valid (not expired) if it's expirationTime is greater then or equal to the current utc date time
      db.collection(cacheCollection).findOne({'key': key, 'expirationTime': {$gte: expirationTime}}, function(err, cachedItem) {
        // If error occured during cache lookup or nothing found pass null to callback and return
        if (err || !cachedItem) {
          // if error occured log it
          err && console.log(err);
          return callback && callback(null);
        }
        // If cached item found pass it to callback
        callback && callback(cachedItem.data);
      });
    },
    // Saves item in cache under passed key
    writeCache: function(key, data) {
      // key should be string and data should be defined
      if ('string' !== typeof key || 'undefined' === typeof data) return;

      // Build cached item
      var cachedItem = {
        key: key,
        expirationTime: moment.utc().add(cacheLifetime).toISOString(),
        data: data
      };

      // Put cached item to cache (upsert is used), do not wait for write operation results
      db.collection(cacheCollection).update({'key':key}, cachedItem, {upsert:true, w:0});
    }
  };
};
