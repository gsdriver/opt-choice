var express = require('express');
var router = express.Router();
var optimizely = require('optimizely-server-sdk');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  var options;
  var optimizelyClient;

  // Get Optimizely datafile
  var url = 'https://cdn.optimizely.com/json/8269995381.json';
  request.get({uri: url, json: true}, (error, response, body) => {
    var useTreatment = false;

    if (!error) {
      optimizelyClient = optimizely.createInstance({datafile: body});

      if (optimizelyClient.activate('my_experiment', req.cookies.cookieName) == 'treatment') {
        console.log('Using treatment');
        useTreatment = true;
      }
    }

    if (useTreatment) {
      // execute code for treatment
      options = [{value: 'Talking Dogs', func: 'DogClicked()'}, {value: 'Fiery pits of hell', func: 'HellClicked()'}];
    } else {
      // execute default code
      options = [{value: 'Fiery pits of hell', func: 'HellClicked()'}, {value: 'Talking Dogs', func: 'DogClicked()'}];
    }

    res.render('index', { title: 'Which is Worse?', options: options, cookie: req.cookies.cookieName });
  });
});

module.exports = router;
