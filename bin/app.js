'use strict';

// Dependencies
var express = require('express'),
    request = require('request'),
    logger = require('morgan'),
    moment = require('moment'),
    config = require('./config'),
    utils = require('./utils'),
    cacheManager; // Lazy created (db injection required)

// Configuration properties
var photoApiUrl = config.photoApi || 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness(10)%20where%20api_key%3D%2292bd0de55a63046155c09f1a06876875%22%20and%20title%20like%20%22%25{QUERY}%25%22%20and%20ispublic%3D1%3B&format=json';

module.exports = function(db) {
  // Create express application
  var app = express();

  var silent = 'development' !== app.get('env');

  // Init cache manager with passed db connection instance
  cacheManager = require('./cacheManager')(db);

  // Log passed request params
  silent || app.use(logger('dev'));

  // Support CORS requests from client app
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // Search API
  app.all('/search',
    // Validate search parameters
    function(req, res, next) {
      var query = req.query.query;

      // Return 400 if query parameter is not passed at all, it's ok if it's passed but value is an empty string
      if ('undefined' === typeof query) {
        return next(utils.error('Bad Request', 400));
      }

      // Query is valid let's continue
      next();
    },

    // If validation passed try get search results from cache
    function(req, res, next) {
      // Try get search results from cache first
      cacheManager.checkCache(req.query.query, function(cachedResults) {
        // If search results found in cache return them, so no additional work is required
        if (cachedResults) {
          return res.status(200).json(cachedResults);
        }

        // Otherwise pass work to the next middleware
        next();
      });
    },

    // Main search handler, retrieves search results from underlying api
    function(req, res, next) {
      var query = req.query.query;

      // {QUERY} is replaced with actual query parameter, replace with empty string is fine
      var requestUrl = photoApiUrl.replace('{QUERY}', query);

      // Retrieves photos info from flickr api
      request(requestUrl, function(apiErr, apiRes, data) {
        // Something went wrong?
        if (apiErr || 200 !== apiRes.statusCode) {
          return next(apiErr);
        }

        // No data returned?
        if (!data) {
          return next(utils.error('Underlying service returned no data'));
        }

        var results = JSON.parse(data);

        // Validate parsed data
        if (!results.query) {
          return next(utils.error('Underlying service returned invalid data'));
        }

        // Put found results to cache
        cacheManager.writeCache(query, results);

        // So everything is ok, return status 200 and search results in JSON format
        res.status(200).json(results);
      });
    }
  );

  // 404 handler
  app.use(function(req, res, next) {
    next(utils.error('Not Found', 404));
  });

  // Error handlers

  // Development error handler
  // Will print stacktrace
  if ('development' === app.get('env')) {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500).json({
        message: err.message,
        error: err
      });
    });
  }

  // Production error handler
  // No stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: {}
    });
  });

  return app;
};
