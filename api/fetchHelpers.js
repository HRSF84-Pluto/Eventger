
const axios = require('axios');
var Yelp = require('yelp');
var ticketmaster = require('tm-api');
  
const apiKeys = require('./apiKeys.js');

// Questions: // 
// What happens when they try to specify more preferences?

var getTMData = (sampleReqBody) => {
  console.log('inside TM api fetch');

  ticketmaster.setAPIKey(`${apiKeys.tmApiKey}`);

  return ticketmaster.events.search({
    startDateTime: sampleReqBody.startDateTime,
    dmaId: 382
  })
  .then(results => {
    console.log('TM API fetch returns - at index 0 - ', results.data._embedded.events[0])

    if (err => { throw err; })

    // will return an array of event objects // 
    return results.data._embedded.events;
  })
  .then(results => {
    return results.map(event => {
      return {
        id: event.id,
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

var getYelpData = (sampleReqBody) => {

  var yelp = new Yelp({
    consumer_key: apiKeys.consumer_key,
    consumer_secret: apiKeys.consumer_secret,
    token: apiKeys.token,
    token_secret: apiKeys.token_secret,
  });

  return yelp.search({ 
    term: sampleReqBody.food, 
    location: sampleReqBody.location
  })
  .then(data => {
    console.log('YELP API fetch returns - at index 0 - ', data.businesses[0])
    
    if (err => { throw err; })
    return data.businesses;
  })
  .then(businesses => {
    return businesses.map(business => {
      return {
        id: business.id.split('-').map(word => {return word[0]; }).join(''),
        eventName: business.name,
        location: {
          line_1: business.location.address[0],
          line_2: business.location.address[1],
          city: business.location.city,
          state: business.location.state_code,
          zip: business.location.postal_code,
          display_address: business.location.display_address,
        },
        // price: `${event.priceRanges[0].min} ${event.priceRanges[0].currency} - ${event.priceRanges[0].max} ${event.priceRanges[0].currency}`,
        url: business.url,
        photoUrl: business.image_url,
        category: business.categories[0],
        phone: business.display_phone
      }
    })
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

// *********************** Retired Code *********************** //

// var getTMData = (sampleReqBody) => {
//   console.log('inside TM api fetch');

//   return axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?
//     dmaId=382&
//     classificationName=${sampleReqBody.queryTerm}&apikey=${apiKeys.tmApiKey}`)
//   // return axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKeys.tmApiKey}`)
//   .then(results => {
//     console.log('TM API fetch returns - at index 0 - ', results.data._embedded.events[0])

//     if (err => { throw err; })

//     // will return an array of event objects // 
//     return results.data._embedded.events;
//   })
//   // .then(results => {
//   //   return results.map(event => {
//   //     return {
//   //       id: event.id,
//   //       eventName: event.name,
//   //       date: event.dates.start.localDate,
//   //       time: event.dates.start.localTime,
//   //       location: {
//   //         line_1: event._embedded.venues[0].name,
//   //         line_2: event._embedded.venues[0].address.line1,
//   //         city: event._embedded.venues[0].city.name,
//   //         state: event._embedded.venues[0].state.stateCode,
//   //         zip: event._embedded.venues[0].city.postalCode
//   //       },
//   //       // price: `${event.priceRanges[0].min} ${event.priceRanges[0].currency} - ${event.priceRanges[0].max} ${event.priceRanges[0].currency}`,
//   //       url: event.url,
//   //       photoUrl: event.images[0].url,
//   //       category: event.classifications[0].segment.name
//   //     }
//   //   })
//   // })
//   .catch(err => {
//     console.log('LOOK HERE!! TM FETCH ERROR: ', err)
//   })
// }

