'use strict';

// Configuration properties
module.exports = {
  apiPort: 3000,
  // Flickr api url, {QUERY} will be replaced with actual query parameter in runtime
  // {API_KEY} should be replaced with you yahoo api key 
  photoApi:'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness(10)%20where%20api_key%3D%22{API_CODE}%22%20and%20title%20like%20%22%25{QUERY}%25%22%20and%20ispublic%3D1%3B&format=json',
  // If more results required consider the following url
  // photoApi:'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness(200)%20where%20api_key%3D%22{API_CODE}%22%20and%20title%20like%20%22%25{QUERY}%25%22%20and%20ispublic%3D1%20limit%20100%3B&format=json',
  cache: {
    db: 'mongodb://localhost:27017/travix', // mongodb://server:port/db
    collection: 'fl_api_cache', // e.g. table
    lifetime: 300000 // 5 minutes (in milliseconds 5*60*1000)
  }
};
