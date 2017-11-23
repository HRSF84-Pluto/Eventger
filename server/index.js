const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fetchHelpers = require('../api/fetchHelpers.js');
const db =  require('../db/db.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () { console.log('Event-gers app listening on port 3000!') });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/')));
app.use(bodyParser.urlencoded({ extended: false }));

//Pulling new data when params change
app.get('/eventData', function (req, res) {
  console.log('inside get handler')

  // to test a sample req.body from front-end's get request
  let sampleReqBody = {
    queryTermForTM: ['sports', 'music'], // both query Terms are defined by homepage selection upon landing on site
    queryTermForYelp: 'food',
    preferenceForMusicOrLeague: 'Rock', // additional keyword search given by user in preferences table [max: 1 word]
    preferenceForFoodAndOrSetting: 'outdoor food', // not reliable for setting since indoor/outdoor isn't a parameter
    sort: 'date,asc',
    city: 'San Francisco',
    postalCode: '94104',
    startDateTime: '2017-01-12T18:00:00Z',
    price: '$$',
  }

  let returnedYelpTMDataObj = {};

  // fetch ticketmaster data
  fetchHelpers.getTMData(sampleReqBody)
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
  // fetchHelpers.getYelpData(sampleReqBody)
  // .then(response => {
  //   res.status(201).send(response);
  // })

});


//Add user to DB
app.post('/signup', function(req, res) {
  //Save user
  db.saveUsernameAsync(req.body)
    .then((results) => res.send(true))
    //will send message if already in DB
    .catch((err)=> {
      console.log(err)
      res.send(false)
    })
});

//Save Events for logged in User
app.post('/events', function(req, res) {
  var events = JSON.parse(req.body.events)

  //Get user ID
  db.findUsernameAsync(req.body.username)
    .then(results => {
      var userId = results.id;
      //For Each event in array list, save to DB
      events.forEach(event => {
        //First check if event is saved to Events table
        db.findEventAsync(event.id)
          .then(results => {
            //If event is not in Events table, save it to Events table
            if (!results) {
              db.saveEventAsync(event)
                .then(results => console.log('Save event into Event DB: ', results))
                .catch(err => console.err(err))
            } //Save eventId and userId to UserEvent table
            db.saveUserEventAsync(userId, event.id)
              .then(results => res.send('Your Data has been saved!'))
              .catch(err => res.send(err))
          })
        .catch(err => console.err(err))
      });
    })
    .catch(err => console.err(err))
});


//Returns users saved results from db
app.post('/login', function(req, res) {
  db.findUserEventsAsync(req.body.username)
  .then(results => res.send(results))
  .catch(err => res.send(err))
})


module.exports = app;
