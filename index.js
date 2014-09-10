'use strict';

// Dependencies
var mongoClient = require('mongodb').MongoClient,
    config = require('./bin/config'),
    app; // Lazy created (db injection required)

// Config properties
var cacheDbConnString = config.cache.db || 'mongodb://localhost:27017/travix',
    cacheCollection = config.cache.collection || 'fl_api_cache',
    port = process.env.PORT || config.apiPort || 3000;

// Connect cache db
// Initialize connection once
mongoClient.connect(cacheDbConnString, function(err, db) {
  // If connection to MongoDB cannot be established then log error and exit
  if (err) {
    console.error('\x1b[31m', 'Could not connect to MongoDB!');
    console.log(err);
    return;
  }

  // Ensures that an cache key index exists, if not creates it
  db.collection(cacheCollection).ensureIndex({'key':1}, {unique:true, background:true, dropDups:true, w:1}, function(err, indexName) {
    // If index cannot be created then log error and exit
    if (err || !indexName) {
      console.error('\x1b[31m', 'Could not create MongoDB index!');
      console.log(err);
      return;
    }

    // Get main service app module
    app = require('./bin/app')(db);
    app.set('port', port);

    // Finally start service as database connection is ready and required index created
    var server = app.listen(app.get('port'), function() {
      console.log('Service started, listening on port %d', server.address().port);
    });
  });
});
