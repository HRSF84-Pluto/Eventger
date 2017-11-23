
const yelp = require('yelp-fusion');
// const ticketmaster = require('tm-api');
  
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
  console.log('inside getYelpData')
  
  let params = { 
    term: sampleReqBody.queryTermForYelp, 
    location: sampleReqBody.postalCode
  }

  // Modify if other preferences are selected by user // 
  Object.assign(params, 
    sampleReqBody.preferenceForFoodAndOrSetting ? { term: sampleReqBody.preferenceForFoodAndOrSetting } : null,
    sampleReqBody.price ? { price: priceMapper(sampleReqBody.price, 'yelp') }: null);
   
  const client = yelp.client(apiKeys.token);
   
  return client.search(params)
  .then(res => {
    console.log('YELP API fetch returns - at index 0 - ', res.jsonBody.businesses[0])
    if (err => { throw err; })
    return res.jsonBody.businesses;
  })
  .then(businesses => {
    return parseForCriticalData(businesses, 'yelp');
  })
  .catch(err => {
    console.log('LOOK HERE!! Yelp FETCH ERROR: ', err)
  });

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
          line_1: business.location.address1,
          line_2: business.location.address2,
          city: business.location.city,
          state: business.location.state,
          zip: business.location.zip_code,
          display_address: business.location.display_address,
        },
        price: business.price,
        url: business.url,
        photoUrl: business.image_url,
        category: business.categories[0].title,
        phone: business.phone
      }
    })
  } 
}

const priceMapper = (dollarSigns, API) => {
  if (API === 'ticketmaster') { // TM: max must be <= the $ given
    let map = {
      $: 10,
      $$: 50,
      $$$: 100,
      $$$$: 500
    }
    return map[dollarSigns]
  } else if (API === 'yelp') {
    let map = {
      $: 1,
      $$: 2,
      $$$: 3,
      $$$$: 4
    }
    console.log('eyayeyay')
    return map[dollarSigns]
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

// *************** Preferences built-in ? ************** //
//                    Ticketmaster        Yelp           //
//  Music/Sports           Yes             n/a           // 
//  Food Type              n/a             Yes           // 
//  Indoor/Outdoor  may not be possible     No           // 
//  Budget                 No              Yes           // 
// ***************************************************** //