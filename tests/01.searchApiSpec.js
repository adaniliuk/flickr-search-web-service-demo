'use strict';

var request = require('request');
var apiHost = 'http://127.0.0.1:3000';

jasmine.getEnv().defaultTimeoutInterval = 10000;

/**
 * Generates a random number within a range
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
var generateRandomNumber = function (min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
};

/**
 * Generates a random string
 * @param {int} [size] Defines the size of the returned string. When omitted is defined as 8
 * @returns {string}
 */
var generateRandomString = function( size ){
  var i, returnStr = '';
  size = size || 8;

  for( i=0; i<size; i++ ){
    returnStr += String.fromCharCode(generateRandomNumber(97,122));
  }

  return returnStr;
};

describe('Search API', function(){

  it('Should return statusCode 400 when no query is defined', function( done ){

    request(apiHost + '/search', function( error, response, body ){

      expect(error).toBeFalsy();
      if( !error ){
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);
        expect(body).toContain('Bad Request');
      }

      done();
    });

  });

  it('Should return statusCode 404 when wrong api method is defined', function( done ){

    request(apiHost + '/nopath', function( error, response, body ){

      expect(error).toBeFalsy();
      if( !error ){
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
        expect(body).toContain('Not Found');
      }

      done();
    });

  });

  it('Should return statusCode 200 and a valid JSON response when passing an empty query', function( done ){

    request(apiHost + '/search?query=', function( error, response, body ){

      expect(error).toBeFalsy();

      if( !error ){
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);

        try{
          body = JSON.parse(body);
        } catch( e ){
          body = false;
        }

        expect(body).toBeTruthy();
      }

      done();
    });
  });

  it('Should return statusCode 200 and a valid JSON response when passing a non-empty query (random)', function( done ){

    var queryStr = generateRandomString();
    request(apiHost + '/search?query=' + queryStr, function( error, response, body ){

      expect(error).toBeFalsy();

      if( !error ){
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);

        try{
          body = JSON.parse(body);
        } catch( e ){
          body = false;
        }

        expect(body).toBeTruthy();
      }

      done();
    });
  });

  it('Should return a JSON object with only one result when we search for a specific title',
    function( done ){
      request(apiHost + '/search?query=', function( error, response, body ){

        expect(error).toBeFalsy();

        if( !error ){
          expect(response).toBeDefined();
          expect(response.statusCode).toBe(200);
          try{
            body = JSON.parse(body);
          } catch( e ){
            body = false;
          }
          expect(body).toBeTruthy();
          expect(body.query.count).toBeGreaterThan(0);

          request(apiHost + '/search?query=' + encodeURIComponent(body.query.results.photo[0].title),
            function( error, response, data ){
              expect(error).toBeFalsy();

              if( !error ){
                expect(response).toBeDefined();
                expect(response.statusCode).toBe(200);
                try{
                  data = JSON.parse(data);
                } catch( e ){
                  data = false;
                }
                expect(data).toBeTruthy();
                expect(data.query.count).toEqual(1);
                expect(data.query.results.photo.title).toEqual(body.query.results.photo[0].title);
              }
              done();
          });
        } else {
          done();
        }
      });
    });
});
