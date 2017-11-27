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


// Sample output from Garrett's helper: //
let sampleReqBody = {
  city: 'Oakland',
  preferenceForMusicOrLeague: ['NBA', 'NFL', 'pop'], // should be populated with Music Genres or Sporting Leagues
  queryTermForTM: ['music', 'sports'], // can only have 'music' or 'sports' (couldn't find other options)
  queryTermForYelp: ['bar', 'coffee', 'breakfast'], // originally populated with the keyterms discussed in Begona's google sheet, but will change thereafter with user preferences
  startDateTime: '2017-11-27T18:00:00Z', 
  price: '$$'
}

app.get('/eventData', function (req, res) {
  console.log('=========================== inside get handler ===========================');

  // // solo api testing purposes //
  // fetchHelpers.getTMData(sampleReqBody)
  // .then(response => {
  //   console.log('BACK IN SERVER BABY!: ', response);
  //   res.status(201).send(response);
  // })

  // let returnedYelpTMDataObj = {};
  
  // fetchHelpers.getTMData(sampleReqBody)
  // .then(ticketMasterEventsArr => {

  //   // include TM event data in the object sent back to front-end //
  //   returnedYelpTMDataObj.ticketmaster = ticketMasterEventsArr;
  //   return;
  // })
  // .then(() => {

  //   // fetch Yelp data
  //   fetchHelpers.getYelpData(sampleReqBody)
  //   .then(yelpEventsArr => {

  //     // include Yelp event data in the object sent back to front-end //
  //     returnedYelpTMDataObj.yelp = yelpEventsArr;
  //     return;
  //   })
  //   .then(() => {
  //     res.status(201).send(returnedYelpTMDataObj);
  //   })
  // })

  // Sally: bug in helper, couldn't use! help Garrett!
  let returnedYelpTMDataObj = {};

  db.reduceSearchAsync(sampleReqBody, null)
  .then(sampleReqBody => {
    console.log('Reduced Sample Body', sampleReqBody);
    
  // fetch ticketmaster data
    return fetchHelpers.getTMData(sampleReqBody)
  }).catch(err => {
    console.log('ERROR in reduceSearchAsync', err)
  }).then(ticketMasterEventsArr => {

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

});


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
const eventDataRoute = require('../routes/eventData');
const saveEventRoute = require('../routes/saveEvent');


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
app.use('/eventData', eventDataRoute);
app.use('/signup', signupRoute);
app.use('/login', loginRoute);


app.use(checkAuthentication);

//TODO: modify the userDataRoute's content to access user data
app.use('/saveEvent', saveEventRoute);
app.use('/userData', userDataRoute);
app.use('/logout', logoutRoute);


//react router's path
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) { //check if it's an authenticated route
    console.log("user is authenticated", req.user);
    next();
  }
  else {
    next();
    //res.status(401).json({});

  }
}

app.listen(PORT, function () { console.log('Event-gers app listening on port 3000!') });




module.exports = app;
