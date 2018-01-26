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

////TO RUN LOCALLY: DBSERVER=localhost DBUSER=root DBPASSWORD=YOURPASSWORD npm run start

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
* Express router: https://goo.gl/8sZehm
* Passportjs: https://goo.gl/7kA7Y4
*             https://goo.gl/iMohYg
*             https://goo.gl/18wQkG
*             https://goo.gl/EaWPGG
*
*/



// const options = {
//   host: process.env.DBSERVER ||'us-cdbr-iron-east-05.cleardb.net',
//   port: 3306,
//   user: process.env.DBUSER  ||'ba3f260f7ba4c4',
//   password: process.env.DBPASSWORD || '0e12068a',
//   database: 'heroku_e67b3a46e336139',
//   checkExpirationInterval: 1,
//   expiration: 1,
// };

const options = {
  host: 'us-cdbr-iron-east-05.cleardb.net' ||'localhost',
  port: 3306,
  user: 'ba3f260f7ba4c4' ||'root',
  password: '0e12068a' ||'password',
  database: 'heroku_e67b3a46e336139' ||'Eventger',
  checkExpirationInterval: 60000,
  expiration: 3600000,
};


//stores sessions created by passportjs, set your db password above
const sessionStore = new MySQLStore(options);

//route files used by express router
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
