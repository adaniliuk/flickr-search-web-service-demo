# Simple Web Service that allows you to search Flickr interestingness photos.

## Introduction

Node.js based Flickr interestingness photos search web service. For demo purposes only!

## Requirements

In order to run the app and tests correctly you need to have the following requirements in your machine:

  - __NodeJS & NPM__ - Normally installed with one package, via [their main website](http://nodejs.org)
  - __MongoDB__ - Ideally, if you are running the apps in your computer, you should also install the [MongoDB database engine](https://www.mongodb.org/), because some developer might have used it as cache storage.

## The procedure

After cloning this repo (and exactly this branch), you should run:

```bash
npm install
```

This command will install the dependencies associated to the web service and testing process.

Then be sure that current repo folder contains data/db folder (or you can create it whenever you want), and local instance of MongoDB is up and running. MongoDB is used to store web service cache data. If it's not running, start it, by doing:

```bash
mongod --dbpath ./data/db
```

When MongoDB is up and running, you should exec:

```bash
npm start
```

This will start search web service at port 3000.

After that, you just need to run the tests, by doing:

```bash
npm test
```

And it will run the tests situated at the _tests_ folder.

## Suggested further web service improvements:
  - Add additional tests tests
    - Underlying server errors, other special cases, etc
    - CacheManager
  - Write errors to app log
  - Separate dev, production, test configurations
  - Use Grunt or Gulp build tasks
    - Linking, minification, etc (review Yeoman tasks)
    - MongoDB auto start
