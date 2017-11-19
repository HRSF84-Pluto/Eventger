const yelp = require('./yelp.js');


// SE: I was just trying to visualize how the data would
//come back, please feel free to reformat and then let
//me know how you would like to see it!

var finalResults = function(params, callback) {

  yelp.getYelpResults(yelpParams, function(data) {
    callback(data)
  });
};




module.exports.finalResults = finalResults;
