
const Yelp = require('yelp');
const ticketmaster = require('tm-api');
  
const apiKeys = require('./apiKeys.js');

// Questions / To Do: // 
// bring in $$$ for yelp businesses
// preferences: budget; indoor/outdoor;

const getTMData = (sampleReqBody) => {
  console.log('inside TM api fetch');

  // Default set of parameters for each search (before additional preferences) //
  let params = {
    apikey: apiKeys.tm_api_key,
    size: '40',
    sort: 'date,asc',
    classificationName: JSON.stringify(sampleReqBody.queryTermForTM),
    startDateTime: sampleReqBody.startDateTime,
    city: sampleReqBody.city,
  }

  // Modify if other preferences are selected by user // 
  Object.assign(params, 
    sampleReqBody.preferenceForMusicOrLeague ? { keyword: sampleReqBody.preferenceForMusicOrLeague } : null);

  // API Fetch // 
  return ticketmaster.events.search(params)
  .then(results => {
    console.log('TM API fetch returns - at index 0 - ', results.data._embedded.events[0])
    if (err => { throw err; })
    return results.data._embedded.events;
  })
  .then(events => {
    return parseForCriticalData(events, 'ticketmaster');
  })
  .catch(err => {
    console.log('LOOK HERE!! TM FETCH ERROR: ', err)
  })
}


const getYelpData = (sampleReqBody) => {

  const yelp = new Yelp({
    consumer_key: apiKeys.yelp_api_key,
    consumer_secret: apiKeys.yelp_consumer_secret,
    token: apiKeys.token,
    token_secret: apiKeys.token_secret,
  });

  let params = { 
    term: sampleReqBody.queryTermForYelp, 
    location: sampleReqBody.postalCode
  }

  // Modify if other preferences are selected by user // 
  Object.assign(params, 
    sampleReqBody.preferenceForFoodAndOrSetting ? { term: sampleReqBody.preferenceForFoodAndOrSetting } : null);

  return yelp.search(params)
  .then(data => {
    console.log('YELP API fetch returns - at index 0 - ', data.businesses[0])
    
    if (err => { throw err; })
    return data.businesses;
  })
  .then(businesses => {
    return parseForCriticalData(businesses, 'yelp');
  })
  .catch(err => {
    console.log('LOOK HERE!! YELP FETCH ERROR: ', err)
  })
}

const parseForCriticalData = (results, API) => {

  if (API === 'ticketmaster') {
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
        price: event.priceRanges ? `${event.priceRanges[0].min} ${event.priceRanges[0].currency} - ${event.priceRanges[0].max} ${event.priceRanges[0].currency}` : 'Price unavailable',
        url: event.url,
        photoUrl: event.images[0].url,
        category: event.classifications[0].segment.name
      }
    })
  } else if (API === 'yelp') {
    return results.map(business => {
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
        price: '$$$ will go here',
        url: business.url,
        photoUrl: business.image_url,
        category: business.categories[0],
        phone: business.display_phone
      }
    })
  } 
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
