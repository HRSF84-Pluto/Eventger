
const apiKeys = require('./apiKeys.js');
const axios = require('axios');
var Yelp = require('yelp');

var getTMData = (testRequestBody) => {
  console.log('inside TM api fetch');

  return axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKeys.tmApiKey}`)
  .then(results => {
    console.log('TM API fetch returns - at index 0 - ', results.data._embedded.events[0])

    if (err => { throw err; })

    // will return an array of event objects // 
    return results.data._embedded.events;
  })
  .then(results => {
    return results.map(event => {
      return {
        eventName: event.name,
        date: event.dates.start.localDate,
        time: event.dates.start.localTime,
        location: {
          line_1: event._embedded.venues[0].name,
          line_2: event._embedded.venues[0].address.line1,
          city: event._embedded.venues[0].city.name,
          state: event._embedded.venues[0].state.stateCode,
          zip: event._embedded.venues[0].city.postalCode
        },
        price: `${event.priceRanges[0].min} ${event.priceRanges[0].currency} - ${event.priceRanges[0].max} ${event.priceRanges[0].currency}`,
        url: event.url,
        photoUrl: event.images[0].url,
        category: event.classifications[0].segment.name
      }
    })
  })
  .catch(err => {
    console.log('LOOK HERE!! TM FETCH ERROR: ', err)
  })
}

// PARAMS for TM FETCH - NOT YET IMPLEMENTED //
// let params = {
//     apikey: apiKeys.tmApiKey,
//     postalCode: testRequestBody.postalCode,
//     startDateTime: testRequestBody.startDateTime,
//     endDateTime: testRequestBody.endDateTime
//   }

var getYelpData = (testRequestBody) => {

  var yelp = new Yelp({
    consumer_key: apiKeys.consumer_key,
    consumer_secret: apiKeys.consumer_secret,
    token: apiKeys.token,
    token_secret: apiKeys.token_secret,
  });

  return yelp.search({ 
    term: testRequestBody.food, 
    location: testRequestBody.location
  })
  .then(function (data) {
    console.log('YELP API fetch returns - at index 0 - ', data.businesses[0])
    
    if (err => { throw err; })

    return data;
  })
  .catch(err => {
    console.log('LOOK HERE!! YELP FETCH ERROR: ', err)
  })
}

module.exports.getTMData = getTMData;
module.exports.getYelpData = getYelpData;

// Request API access: http://www.yelp.com/developers/getting_started/api_access

// See http://www.yelp.com/developers/documentation/v2/search_api

// In case we want a more in-depth search
// See http://www.yelp.com/developers/documentation/v2/business
// yelp.business('yelp-san-francisco')
//   .then(console.log)
//   .catch(console.error);
