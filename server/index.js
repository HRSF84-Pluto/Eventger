const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const passport = require('passport');
const fetchHelpers = require('../api/fetchHelpers.js');
const db =  require('../db/db.js');
const Promise = require('bluebird');

const PORT = process.env.PORT || 3000;

/*
NOTE: the backend is using passportjs to create sessions and authenticate users.
* It uses the express router to organize the different routes (the routes corresponding to a certain path are in the routes directory).
* The morgan middleware logs request details to the terminal
* flash middleware flashes messages
* the database is currently storing the hashed password and the unhashed password for testing: unhashed password will need to be removed
* To set the env.DBPASSWORD, set the env variable before the 'npm run start' script like this:
           DBPASSWORD=YOURDBPASSWORD npm run start

Helpful links:
* Setting env: https://goo.gl/VJoaUC
* Express router: https://goo.gl/xntCiX
* Passportjs: https://goo.gl/7kA7Y4
*             https://goo.gl/iMohYg
*             https://goo.gl/18wQkG
*             https://goo.gl/EaWPGG
*
*/

//TODO: Will move these routes to the routes directory - briceida

// Sample output from Garrett's helper: //
let sampleReqBody = {
  queryTermForTM: ['sports', 'music'], // both query Terms are defined by homepage selection upon landing on site
  preferenceForMusicOrLeague: ['NBA'], // additional keyword given by user in preferences table [max: 1 word] to narrow down sports or music
  queryTermForYelp: ['Thai Food', 'Mexican Food'], // default Yelp fetch from homepage 
  // queryTermForYelp: ['Chinese Food', 'Brewery', 'Dance Clubs', 'Museums', 'Hike'], // default Yelp fetch from homepage 
  city: 'San Francisco',
  startDateTime: '2017-01-12T18:00:00Z',
  price: '$$$'
}

app.get('/eventData', function (req, res) {
  console.log('=========================== inside get handler ===========================');

  // solo api testing purposes
  fetchHelpers.getYelpData(sampleReqBody)
  .then(response => {
    console.log('BACK IN SERVER!!! RESPONSE IS: ', response[0])
    res.status(201).send(response);
  })

  // fetchHelpers.getTMData(sampleReqBody)
  // .then(ticketMasterEventsArr => {

  //   // include TM event data in the object sent back to front-end //
  //   returnedYelpTMDataObj.ticketmaster = ticketMasterEventsArr;
  //   return;
  // })
  // .then(placeholder => {

  //   // fetch Yelp data
  //   fetchHelpers.getYelpData(sampleReqBody)
  //   .then(yelpEventsArr => {

  //     // include Yelp event data in the object sent back to front-end //
  //     returnedYelpTMDataObj.yelp = yelpEventsArr;
  //     return;
  //   })
  //   .then(placeholder => {
  //     res.status(201).send(returnedYelpTMDataObj);
  //   })
  // })


  // db.reduceSearchAsync(sampleReqBody, 1)
  // .then(sampleReqBody => {
  //   console.log('Reduced Sample Body', sampleReqBody);

  //   let returnedYelpTMDataObj = {};
  // // fetch ticketmaster data
  //   return fetchHelpers.getTMData(sampleReqBody)
  // }).catch(err => {
  //   console.log('ERROR in reduceSearchAsync', err)
  // }).then(ticketMasterEventsArr => {

  //   // include TM event data in the object sent back to front-end //
  //   returnedYelpTMDataObj.ticketmaster = ticketMasterEventsArr;
  //   return;
  // })
  // .then(placeholder => {

  //   // fetch Yelp data
  //   fetchHelpers.getYelpData(sampleReqBody)
  //   .then(yelpEventsArr => {

  //     // include Yelp event data in the object sent back to front-end //
  //     returnedYelpTMDataObj.yelp = yelpEventsArr;
  //     return;
  //   })
  //   .then(placeholder => {
  //     res.status(201).send(returnedYelpTMDataObj);
  //   })
  // })


});

const options = {
  host: process.env.DBSERVER || 'localhost',
  port: 3306,
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || '',
  database: 'eventger',
  checkExpirationInterval: 60000,
  expiration: 3600000,
};

//stores sessions created by passportjs, set your db password above
const sessionStore = new MySQLStore(options);

//express router declarations
const loginRoute = require('../routes/login');
const signupRoute = require('../routes/signup');
const userDataRoute = require('../routes/userData');
const logoutRoute = require('../routes/logout');


//middleware used by passportjs
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/')));
app.use(bodyParser.urlencoded({ extended: false }));
//creates session
app.use(session({
  secret: 'secret',
  store: sessionStore,
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 3600000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//middleware checks the status of session
// app.use(function (req, res, next) {
//   console.log('req user:', req.user);
//   console.log('cookie', req.cookies);
//   console.log('body', req.body);
//   console.log('session', req.session);
//   console.log('is authenticated?', req.isAuthenticated());
//   next();
// });

//express router middleware
app.use('/signup', signupRoute);
app.use('/login', loginRoute);



app.use(checkAuthentication);

//TODO: modify the userDataRoute's content to access user data
app.use('/userData', userDataRoute);
app.use('/logout', logoutRoute);

//react router's path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});



function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) { //check if it's an authenticated route
    console.log("user is authenticated", req.user);
    next();
  }
  else {
    res.status(401).json({});
  }
}






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


app.listen(PORT, function () { console.log('Event-gers app listening on port 3000!') });




module.exports = app;
