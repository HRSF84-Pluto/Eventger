const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const fetchHelpers = require('../api/fetchHelpers.js');
const db =  require('../db/db.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

router.get('/', function (req, res) {

  console.log('inside get handler');

  // to test a sample req.body from front-end's get request
  let sampleReqBody = {
    queryTermForTM: ['sports', 'music'], // can only have 'music' or 'sports' (couldn't find other options)
    preferenceForMusicOrLeague: ['NBA', 'NFL', 'POP'], // remind Garrett that you made TM fetch loop dyanmic too so this can have as many words as yelp's query terms (rec max: 3)
    queryTermForYelp: ['museum', 'brewery', 'thai food'],  // originally populated with the keyterms discussed in Begona's google sheet, but will change thereafter with user preferences
    location: '94104',
    startDateTime: '2017-01-12T18:00:00Z',
    price: '$$',
  };

  let returnedYelpTMDataObj = {};

  db.reduceSearchAsync(sampleReqBody, null)
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


