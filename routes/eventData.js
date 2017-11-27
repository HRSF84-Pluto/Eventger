const express = require('express');
const router = express.Router();
const fetchHelpers = require('../api/fetchHelpers.js');
const db =  require('../db/db.js');


router.get('/', function (req, res) {

  console.log('inside get handler');

  // to test a sample req.body from front-end's get request
  let sampleReqBody = {
    queryTermForTM: ['sports', 'music'], // can only have 'music' or 'sports' (couldn't find other options)
    preferenceForMusicOrLeague: ['NBA'], // remind Garrett that you made TM fetch loop dyanmic too so this can have as many words as yelp's query terms (rec max: 3)
    queryTermForYelp: ['museum', 'brewery', 'thai food'],  // originally populated with the keyterms discussed in Begona's google sheet, but will change thereafter with user preferences
    postalCode: 94104,
    startDateTime: '2017-01-12T18:00:00Z',
    price: '$$',
    // city: 'San Francisco', // taken out for postalCode b/c latlongitude is more robust for search
  };

  //TODO: Delete sampleReqBody above;

  //reassigning to actual object
  //sampleReqBody  = req.body;
  let returnedYelpTMDataObj = {};

  db.reduceSearchAsync(sampleReqBody, 1)
    .then(sampleReqBody => {

      console.log('Reduced Sample Body', sampleReqBody);

      // fetch ticketmaster data
      return fetchHelpers.getTMData(sampleReqBody)
    })
    .catch(err => {
      console.log('ERROR in reduceSearchAsync', err)
  })
    .then(ticketMasterEventsArr => {

    // include TM event data in the object sent back to front-end //
    returnedYelpTMDataObj.ticketmaster = ticketMasterEventsArr;
    return;
  })
    .then(placeholder => {

      // fetch Yelp data
      fetchHelpers.getYelpData(sampleReqBody)
        .then(yelpEventsArr => {

          // include Yelp event data in the object sent back to front-end //
          returnedYelpTMDataObj.yelp = yelpEventsArr;
          return;
        })
        .then(placeholder => {
          res.status(201).send(returnedYelpTMDataObj);
        })
    })

  // solo api testing purposes
  // fetchHelpers.getYelpData(sampleReqBody)
  // .then(response => {
  //   res.status(201).send(response);
  // })

});

module.exports = router;


// BRI's original body from above moved down and commented out // 
// router.post('/', function (req, res) {
// // TODO: Uncomment this and remove the one above to make this route work with garrett's/sally's code;

//   const sampleReqBody = req.body;
//   // >>>>>> first three keys are arrays
//   // to test a sample req.body from front-end's get request
//   // let sampleReqBody = {
//   //   queryTermForTM: ['music', 'sports'], // both query Terms are defined by homepage selection upon landing on site
//   //   preferenceForMusicOrLeague: 'Rock', // additional keyword given by user in preferences table [max: 1 word] to narrow down sports or music
//   //   queryTermForYelp: ['food','dance'], // default Yelp fetch from homepage
//   //   preferenceForFoodAndOrSetting: 'Mexican', // additional keyword given by user to narrow down type of food
//   //   // activity: 'hiking', // if user doesn't want food but wants an activity - yelp category: https://www.yelp.com/developers/documentation/v2/all_category_list
//   //   city: 'San Francisco',
//   //   startDateTime: '2017-01-12T18:00:00Z',
//   //   price: '$$',
//   // };

//   let returnedYelpTMDataObj = {};

//   // fetch ticketmaster data
//   fetchHelpers.getTMData(sampleReqBody)
//     .then(ticketMasterEventsArr => {

//       // include TM event data in the object sent back to front-end //
//       returnedYelpTMDataObj.ticketmaster = ticketMasterEventsArr;
//       return;
//     })
//     .then(placeholder => {

//       // fetch Yelp data
//       fetchHelpers.getYelpData(sampleReqBody)
//         .then(yelpEventsArr => {

//           // include Yelp event data in the object sent back to front-end //
//           returnedYelpTMDataObj.yelp = yelpEventsArr;
//           return;
//         })
//         .then(placeholder => {
//           res.status(201).send(returnedYelpTMDataObj);
//         })
//     })

//   // solo api testing purposes
//   // fetchHelpers.getYelpData(sampleReqBody)
//   // .then(response => {
//   //   res.status(201).send(response);
//   // })
// });
