const ticketmaster = require('tm-api');
const yelp = require('yelp-fusion');
const Promise = require('bluebird');
  
const apiKeys = require('./apiKeys.js');

const getTMData = (reqBody) => {
  let tmCummulativeEvents = []; 
  let userPreferences = reqBody.preferenceForMusicOrLeague;

  const fetchTMData = (preference) => {
    // Default set of parameters for each search (before additional preferences) //
    let params = {
      apikey: apiKeys.tm_api_key,
      size: '40',
      sort: 'date,asc',
      classificationName: JSON.stringify(reqBody.queryTermForTM),
      startDateTime: reqBody.startDateTime,
      city: reqBody.city,
    }

    // Modify fetch params if other preferences are selected by user // 
    Object.assign(params, 
      reqBody.preferenceForMusicOrLeague ? { keyword: preference } : null);

    // BEGIN: API fetch
    return ticketmaster.events.search(params)
    .then(results => {
      console.log('TM API fetch returns - at index 0 - ', results.data._embedded.events[1])
      if (err => { throw err; })
      return results.data._embedded.events;
    })
    .then(events => {
      if (reqBody.price) { // filter for price preference if exists
        return events.filter(event => {
          let eventPrice = event.priceRanges
          if (eventPrice) { // if event price is available, compare; otherwise, let it filter through
            return (Number(eventPrice[0].min)+Number(eventPrice[0].max))/2 <= priceMapper(reqBody.price, 'ticketmaster');
          }
          return event;
        })
      }
      return events;
    })
    // only return data we want
    .then(events => {
      return parseForCriticalData(events, 'ticketmaster');
    })
    // take only top 2 of results and concat to cummulative event array
    .then(parsedEvents => {
      if (reqBody.preferenceForMusicOrLeague) {
        let top2EventsForThisPreference = parsedEvents.slice(0, 2)
        tmCummulativeEvents = tmCummulativeEvents.concat(top2EventsForThisPreference);
      } else {
        return parsedEvents
      }
    })
    .catch(err => {
      console.log('LOOK HERE!! TM FETCH ERROR: ', err)
    })  
  }

  // if fetch is from homepage, return an uncustomized array of events
  if (!reqBody.preferenceForMusicOrLeague) {
    return fetchTMData()
  // if user has specified preferences, loop through preferences and return a cummulative array of events
  } else { 
    return Promise.each(userPreferences, fetchTMData)
    // after Fetch Loop is finished, return the final cummulative array of events
    .then(() => {
      return tmCummulativeEvents;    
    })
    .catch(err => {
      console.log('LOOK HERE!! TM - OUTSIDE FETCHLOOP ERROR: ', err)
    });
  }
}

const getYelpData = (reqBody) => {
  let yelpCummulativeEvents = []; 
  let userPreferences = reqBody.queryTermForYelp;

  const getYelpData = (preference) => {
    // prep the fetch
    let params = { 
      sort_by: 'rating',
      term: preference, 
      location: reqBody.city,
    }
 
    // Modify fetch params if other preferences are selected by user // 
    Object.assign(params, 
      reqBody.price ? { price: priceMapper(reqBody.price, 'yelp') } : null);
     
    const client = yelp.client(apiKeys.token);

    // BEGIN: API fetch
    return client.search(params)
    .then(res => {
      // console.log('YELP API fetch returns - at index 0 - ', res.jsonBody.businesses[0])
      if (err => { throw err; })
      return res.jsonBody.businesses;
    })
    // parse for only data we need and add to the returned cummulative events array
    .then(businesses => {
      return parseForCriticalData(businesses, 'yelp')
    })
    .then(parsedBusinesses => {
      let top2EventsForThisPreference = parsedBusinesses.slice(0, 2)
      yelpCummulativeEvents = yelpCummulativeEvents.concat(top2EventsForThisPreference);
    })
    .catch(err => {
      console.log('LOOK HERE!! Yelp - INSIDE FETCHLOOP ERROR: ', err)
    });
  }

  return Promise.each(userPreferences, getYelpData)
  // after Fetch Loop is finished, return the final cummulative array of events
  .then(() => {
    return yelpCummulativeEvents;    
  })
  .catch(err => {
    console.log('LOOK HERE!! Yelp - OUTSIDE FETCHLOOP ERROR: ', err)
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
        price: event.priceRanges ? `${event.priceRanges[0].min} ${event.priceRanges[0].currency} - ${event.priceRanges[0].max} ${event.priceRanges[0].currency}` : 'No Price Provided',
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
      $: 100,
      $$: 500,
      $$$: 1500,
      $$$$: 5000
    }
    return map[dollarSigns]
  } else if (API === 'yelp') {
    let map = {
      $: 1,
      $$: 2,
      $$$: 3,
      $$$$: 4
    }
    return map[dollarSigns]
  }
}

module.exports.getTMData = getTMData;
module.exports.getYelpData = getYelpData;

// Left To Do: //
// Do we want to filter out events without a provided price? 

// When we use SF city as TM param, it doesn't include Oakland games (NBA)..
  // solution: zipcode node module > get latlong > use radius parameter

// Front-End: must handle fetches that return no results by checking to see result count
  // if count = 0, keep current event feed
  // if not, replace with new results

//************************** RETIRED CODE **************************//


