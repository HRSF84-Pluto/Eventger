// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');


// See http://www.yelp.com/developers/documentation/v2/search_api

var getYelpResults = function(){

  var yelp = new Yelp({
    consumer_key: 'kOB5y3x9eCHEslUBmZ7MsQ',
    consumer_secret: 'D7eJ7E8MYfx-BBAcRmMRRmOulKk',
    token: 'syqKQS-gY8KlD1mTMNoUItC7bagScUER',
    token_secret: 'u-KDzdHnpyElCp7-DrrsPPDsFOc',
  });

  yelp.search({ term: 'food', location: 'Montreal' })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.error(err);
  });
}






// // In case we want a more in-depth search
//See http://www.yelp.com/developers/documentation/v2/business
// yelp.business('yelp-san-francisco')
//   .then(console.log)
//   .catch(console.error);

module.exports.getYelpResults = getYelpResults;
