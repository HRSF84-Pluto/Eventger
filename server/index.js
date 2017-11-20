const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fetchHelpers = require('../api/fetchHelpers.js');

const PORT = process.env.PORT || 3000;
const db = require('../db/db.js')



app.listen(PORT, function () { console.log('Event-gers app listening on port 3000!') });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/')));
app.use(bodyParser.urlencoded({ extended: false }));

//Pulling new data when params change
app.get('/eventData', function (req, res) {
  console.log('inside get handler')

  // to test a sample req.body from front-end's get request
  let testRequestBody = {
    postalCode: '94134',
    startDateTime: '2018-11-11T18:00:00Z',
    endDateTime: '2018-11-12T03:00:00Z',
    food: 'Thai',
    location: 'San Francisco'
  }

  let returnedYelpTMDataArr = [];

  // API helper call //

  // fetch ticketmaster data
  fetchHelpers.getTMData(testRequestBody)
  .then(ticketMasterEventsArr => {

    // include TM event data in the object sent back to front-end //
    returnedYelpTMDataArr.push(ticketMasterEventsArr);
    return;
  })
  .then(placeholder => {

    // fetch Yelp data
    fetchHelpers.getYelpData(testRequestBody)
    .then(yelpEventsArr => {

      // include Yelp event data in the object sent back to front-end //
      returnedYelpTMDataArr.push(yelpEventsArr);
      return;
    })
    .then(placeholder => {
      res.status(201).send(returnedYelpTMDataArr);
    })
  })

});
///test



//Add user to DB
app.post('/signup', function(req, res) {
  //req.body.userName
  // check DB if user exisits
    //If YES, then send back message that says
    //the user is already signed up
    //If NO, then add the user to DB
  //res.send(answer)
})


//Check to see if user is in DB, and return saved results
app.post('/login', function(req, res) {
  //req.body.userName
  // check DB if user exisits
    //If YES then return saved db results
    //If NO then return messsage that says
    //thye are not in our DB
  //res.send(answer)
})




///test
