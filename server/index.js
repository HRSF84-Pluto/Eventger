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

const PORT = process.env.PORT || 3000;

const options = {
  host: process.env.DBSERVER || 'localhost',
  port: 3306,
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || 'oderay13',
  database: 'eventger',
  checkExpirationInterval: 60000,
  expiration: 3600000,
};

const sessionStore = new MySQLStore(options);

const loginRoute = require('../routes/login');
const signupRoute = require('../routes/signup');



app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/')));
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use(function (req, res, next) {
  console.log('req user:', req.user);
  console.log('cookie', req.cookies);
  console.log('body', req.body);
  console.log('session', req.session);
  console.log('is authenticated?', req.isAuthenticated());
  next();
});

app.use('/login', loginRoute);
app.use('/signup', signupRoute );


//react router's path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


//Pulling new data when params change
app.get('/eventData', function (req, res) {
  console.log('inside get handler');

  // to test a sample req.body from front-end's get request
  let sampleReqBody = {
    queryTermForTM: ['sports', 'music'], // both query Terms are defined by homepage selection upon landing on site
    preferenceForMusicOrLeague: 'Rock', // additional keyword given by user in preferences table [max: 1 word] to narrow down sports or music
    queryTermForYelp: 'food', // default Yelp fetch from homepage
    preferenceForFoodAndOrSetting: 'Mexican', // additional keyword given by user to narrow down type of food
    // activity: 'hiking', // if user doesn't want food but wants an activity - yelp category: https://www.yelp.com/developers/documentation/v2/all_category_list
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

  // solo api testing purposes
  // fetchHelpers.getYelpData(sampleReqBody)
  // .then(response => {
  //   res.status(201).send(response);
  // })

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


app.use(checkAuthentication);

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) { //check if it's an authenticated route
    next();
  }
  else {
    res.status(401).json({});
  }
}
app.listen(PORT, function () { console.log('Event-gers app listening on port 3000!') });




module.exports = app;
