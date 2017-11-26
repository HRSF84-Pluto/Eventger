var Sequelize = require('sequelize');
var mysql = require('mysql');
var Promise = require('bluebird');
const createTables = require('./config');
const database = 'Eventger';

// -- OBJECT Example
// -- User Object
// -- {
// --   username: string
// --   location: string with zipcode
// --   password: leave blank
// --   preferences: stringified array
// -- }

// -- Event Obj
// -- {
// --   eventName: string
// --   date: string
// --   time: string
// --   location: {
// --     line_1: string
// --     line_2: string
// --     city: string
// --     state: string two letter
// --     zip: string
// --     }
// --   price: string
// --   url: string
// --   photoUrl: string
// --   category: string
// -- }


//FUNCTIONS HAVE BEEN PROMISIFIED
//USE
//findUsernameAsync
//  .then((userObj) => {})  //obj will be undefined if it doesn't exist
//saveUsernameAsync
//  .then(() => {})
//  .catch(username already exists => {})

var db = mysql.createConnection({
  host: process.env.DBSERVER ||'localhost',
  user: process.env.DBUSER  ||'root',
  database: 'Eventger',
  password: process.env.DBPASSWORD || ''
});


db.findUsername = (username, id, callback) => {
  var findQuery;
  var queryInput;
  if (username !== null) {
    findQuery = "SELECT * FROM users WHERE (username=?)";
    queryInput = username;
  } else {
    findQuery = "SELECT * FROM users WHERE (id=?)";
    queryInput = id;
  }

  db.query(findQuery, [queryInput], function(err, result, fields) {
    if (err) {
      callback(err, null);
    }
    result[0].preferences = JSON.parse(result[0].preferences);
    callback(null, result[0]);

  })
};

db.getHash = (username, callback) => {
  var findQuery = "SELECT hash FROM users WHERE (username=?)";
  var queryInput = username;
  db.query(findQuery, [queryInput], function(err, result, fields) {
    console.log("result inside get hash", result[0].hash);
    if (err) {
      callback(err, null);
    }
    callback(null, result[0].hash);
  })
};


//TODO: DELETE THIS FUNCTION, functionality now covered by findUsername;
db.findById = (id, callback) => {
  var findQuery = "SELECT * FROM users WHERE (id=?)";
  var queryInput = id;
  db.query(findQuery, [queryInput], function(err, result, fields) {
    if (err) {
      callback(err, null);
    }
    callback(null, result[0]);
  })
}

//TODO: remove unhashed password
db.saveUsername = (userObj, hash, callback) => {
  console.log(' hash inside saveUsername', hash);
  var insertQuery = "INSERT INTO users (username, password, location, hash) VALUES ?";
  var queryInput = [[ userObj.username, userObj.password, userObj.location, hash ]]
  db.query(insertQuery, [queryInput], function(err, result, fields) {
    if (err) {
      callback(err, null);
    }
    callback(null, result);
  })
}

db.findEvent = (id, callback) => {
  var findQuery = "SELECT * FROM events WHERE (id=?)";
  var queryInput = id;
  db.query(findQuery, [queryInput], function(err, result, fields) {
    if (err) {
      callback(err, null);
    }
    callback(null, result[0]);
  })
};

db.findUserEvents = (username, callback) => {
  var findQuery = "SELECT events.id, eventName, date, time, events.location, price, url, photoUrl, category \
                   FROM events INNER JOIN usersEvents INNER JOIN users \
                   WHERE events.id=usersEvents.event_id \
                   AND usersEvents.user_id=users.id \
                   AND (users.username=?)";
  var queryInput = username;
  db.query(findQuery, [queryInput], function(err, results, fields) {
    if (err) {
      callback(err, null);
    };
    if(results !== undefined) {
      results.map((result) => {
        result.location = JSON.parse(result.location);
      });
    }
    callback(null, results);
  })
};

db.saveEvent = (eventObj, callback) => {
  var insertQuery = "INSERT INTO events SET ?";
  eventObj.location = JSON.stringify(eventObj.location)
  db.query(insertQuery, eventObj, function(err, result, fields) {
    if (err) {
      callback(err, null);
    };
    callback(null, result);
  })
}


db.updatePreferences = (userId, category, callback) => {
  db = Promise.promisifyAll(db);
  db.findUsernameAsync(null, userId)
  .then((userData) => {
    var userPrefArr = userData.preferences
    if (userPrefArr === null) {
        userPrefArr = [];
    } else if (userPrefArr.includes(category)) {
      callback(null, 'Category already exists in array')
      return
    }
    userPrefArr.push(category)
    var updateQuery = "UPDATE users SET preferences= ? WHERE id= ?"
    var queryInput = [JSON.stringify(userPrefArr), userId]
    db.query(updateQuery, queryInput, function(err, result, fields) {
      if (err) {
        callback(err, null);
      };
      callback(null, result);
    })
  })
}

db.saveUserEvent = (userId, eventId, callback) => {
  db = Promise.promisifyAll(db);

  db.findEventAsync(eventId)
  .then((eventData) => {
    return db.updatePreferencesAsync(userId, eventData.category)
  }).then(() => {
    var insertQuery = "INSERT INTO usersEvents (user_id, event_id) VALUES ?"
    var queryInput = [[userId, eventId]]

    db.query(insertQuery, [queryInput], function(err, result, fields) {
      if (err) {
        callback(err, null);
      };
      callback(null, result);
    });
  })
}


// let sampleReqBody = {
//   queryTermForTM: ['sports', 'music'], // both query Terms are defined by homepage selection upon landing on site
//   preferenceForMusicOrLeague: 'Rock', // additional keyword given by user in preferences table [max: 1 word] to narrow down sports or music
//   queryTermForYelp: 'food', // default Yelp fetch from homepage
//   // preferenceForFoodAndOrSetting: 'Mexican', // additional keyword given by user to narrow down type of food
//   // activity: 'hiking', // if user doesn't want food but wants an activity - yelp category: https://www.yelp.com/developers/documentation/v2/all_category_list
//   city: 'San Francisco',
//   postalCode: '94104',
//   startDateTime: '2017-01-12T18:00:00Z',
//   price: '$$',
// }

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

db.reduceSearch = (searchObj, userId, callback) => {
  db = Promise.promisifyAll(db);
  var narrowSearch = (queryTerms) => {
    var narrowedSearch = [];
    if (queryTerms.length > 2) {
         for (var i = 0; i < 2; i++) {
            var randomInt = getRandomInt(queryTerms.length)
            narrowedSearch.push(queryTerms[randomInt])
            queryTerms.splice(randomInt, 1);
         }
    } else {
        narrowedSearch = queryTerms;
    }
    return narrowedSearch;
  }

  if (userId) {
     db.findUsernameAsync(null, userId)
     .then((userData) => {
       searchObj.queryTermForYelp = searchObj.queryTermForYelp.concat(userData.preferences);
       searchObj.queryTermForYelp = narrowSearch(searchObj.queryTermForYelp);
     })
     .catch(err => callback(err, null))
     .then(() => {
        if (searchObj.preferenceForMusicOrLeague.length > 1) {
          searchObj.preferenceForMusicOrLeague = [searchObj.preferenceForMusicOrLeague[getRandomInt(searchObj.preferenceForMusicOrLeague.length)]]
        }
        callback(null, searchObj);
     })
  } else {
     searchObj.queryTermForYelp = narrowSearch(searchObj.queryTermForYelp);
     if (searchObj.preferenceForMusicOrLeague.length > 1) {
      searchObj.preferenceForMusicOrLeague = [searchObj.preferenceForMusicOrLeague[getRandomInt(searchObj.preferenceForMusicOrLeague.length)]]
    }
    callback(null, searchObj);
  }
}

module.exports = Promise.promisifyAll(db);



db.connectAsync()
.then(() => console.log(`Connected to ${database} database`))
.then(() => db.queryAsync(`CREATE DATABASE IF NOT EXISTS ${database}`))
.then(() => db.queryAsync(`USE ${database}`))
.then(() => createTables(db))
.catch((err) => {if (err) console.log('ERROR with Connection', err)})
.then(() => {
})////////End of the then after establishing connection - move around for testing




//------------------------------Testing Updating Preferences---------------------------
// var fakeEvent = {
//     id: 'abcdef',
//     eventName: 'Blink 182 Concert',
//     date: 'January 18, 2018',
//     time: '4:00pm',
//     location: {
//         line_1: '1080 Folsom St',
//         city: 'San Francisco',
//         state: 'CA',
//         zip: '94102'
//     },
//     price: '$50.00',
//     url: 'https://www.ticketmaster.com/Blink-182-tickets/artist/790708',
//     photoUrl: 'https://s1.ticketm.net/tm/en-us/dam/a/9ec/f80aa88d-71fb-4b5f-955c-a3a3e87109ec_118051_CUSTOM.jpg',
//     category: 'music'
// }

// var fakeUser = {
//     username: 'George',
//     password: '',
//     location: 'the Bay'
// }

// db.saveUsernameAsync(fakeUser)
//     .then((userSaveSuccess) => {
//       console.log('User Saved Successfully ', userSaveSuccess)
//       return db.saveEventAsync(fakeEvent)
//     }).then( (eventSaveSuccess) => {
//       console.log('Successfully Saved Event', eventSaveSuccess)
//       return db.saveUserEventAsync(1,'abcdef')
//     }).catch(() => {
//       console.log('Event Already Saved')
//       return db.saveUserEventAsync(1,'abcdef')
//     })
//     .then( (userEventSaveSuccess) => {
//       console.log('Successfully Saved User Event Relationship', userEventSaveSuccess)
//       return db.findUsernameAsync(fakeUser.username, null);
//     }).then((userData) => {
//         console.log('Found the user preferences', userData.preferences)
//     })





//-------------ASYNC TESTING ONLY WORKS IF INCLUDED AFTER EXPORT STATEMENT---------------------
// db.saveUsernameAsync({username: 'Sally', password: '', location: 'the BAY'})
//     .then((data) => {
//       console.log('DATA ', data)
//     })
    //   return db.findUsernameAsync('Mickey')
    // }).then((data) => {
    //     console.log('Mission Complete!', data)
    // }).catch((err) => {
    //     console.log('Mission Failed!', err)
    // })




//----------------------------Event DB Helper Function Tests--------------------------

// var fakeEvent = {
//     eventName: 'Blink 182 Concert',
//     date: 'January 18, 2018',
//     time: '4:00pm',
//     location: {
//         line_1: '1080 Folsom St',
//         city: 'San Francisco',
//         state: 'CA',
//         zip: '94102'
//     },
//     price: '$50.00',
//     url: 'https://www.ticketmaster.com/Blink-182-tickets/artist/790708',
//     photoUrl: 'https://s1.ticketm.net/tm/en-us/dam/a/9ec/f80aa88d-71fb-4b5f-955c-a3a3e87109ec_118051_CUSTOM.jpg',
//     category: 'music'
// }


// db.saveEventAsync(fakeEvent).then( (data) => {
//   console.log('Successfully Saved Event', data)
// })

// db.saveUserEventAsync(1,1).then( (data) => {
//   console.log('Successfully Saved User Event Relationship', data)
// })

// db.findUserEventsAsync('Jarvis').then((data) => {
//     console.log('Successfully Found Events', data)
// })



// db.findUserEvents

//--------------------------------------------------------------------------
// db.connect((error) => {
//   if (error) {console.log('ERROR', error)}

//   var userInsert = "INSERT INTO users (username, zip, password) VALUES ?";
//   var userInput = [['Johnny', '94125', 'purpleNurple']]
//   // db.query(userInsert, [userInput], function (err, result) {
//   //   if (err) throw err;
//   //   console.log(result);
//   // });

//   var userInput2 = [['George', '94125', 'purpleNurple']]

//   var eventInsert = "INSERT INTO events (eventName, date, time, location, price, url, photoUrl, category) VALUES ?";
//   var eventInput = [['End of the World', '3/25/2012', '3:15', 'Earth', 'Free', 'blah', 'blah', 'doom']]
//   // db.query(eventInsert, [eventInput], function (err, result) {
//   //   if (err) throw err;
//   //   console.log(result);
//   // });

//   var eventInput2 = [['Hello World', '3/25/2012', '3:15', 'Earth', 'Free', 'blah', 'blah', 'doom']]

//   var manyInsert = "INSERT INTO usersEvents (user_id, event_id) VALUES ((SELECT id FROM users WHERE username= ?), (SELECT id FROM events WHERE eventName= ?))"
//   var manyInput = ['Johnny','End of the World']
//   // db.query(manyInsert, manyInput, function(err, result) {
//   //   if (err) throw err;
//   //   console.log(result);
//   // })

//   var manyInput2 = ['George','End of the World']

//   db.query(userInsert, [userInput], function (err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.query(eventInsert, [eventInput], function (err, result) {
//         if (err) throw err;
//         console.log(result);
//         db.query(manyInsert, manyInput, function(err, result) {
//             if (err) throw err;
//             console.log(result);
//             db.query(userInsert, [userInput2], function(err, result) {
//                 if (err) throw err;
//                 console.log(result);
//                 db.query(eventInsert, [eventInput2], function(err, result) {
//                     if (err) throw err;
//                     console.log(result);
//                     db.query(manyInsert, manyInput2, function(err, result) {
//                         if (err) throw err;
//                         console.log(result);
//                         db.saveUsername({username: 'Gman', password: '', zip: 'the BAY'}, (data) => {
//                             console.log('DATA AFTER SAVE', data)
//                         })
//                         db.findUsername('Johnny', (data) => {
//                             console.log('DATA AFTER FIND', data)
//                         });
//                     })
//                 })
//               })
//           })
//       });
//   });

// });



//------------------------------------Sequelize Format-------------------------------------------

// var sequelize = new Sequelize({
//   database: 'Eventger',
//   username: 'root',
//   host: 'localhost',
//   dialect: 'mysql',

//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
// });

// const User = sequelize.define('user', {
//   // id: {
//   //   type: Sequelize.INTEGER,
//   //   autoIncrement: true,
//   //   unique: true,
//   //   primaryKey: true
//   // },
//   displayName: {
//     type: Sequelize.STRING
//   },
//   username: {
//     type: Sequelize.STRING,
//     // unique: true
//   },
//   password: {
//     type: Sequelize.STRING
//   },
//   location: {
//     type: Sequelize.STRING
//   }
// });


// const Event = sequelize.define( 'event', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     unique: true,
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING
//   },
//   description: {
//     type: Sequelize.STRING
//   },
//   when: {
//     type: Sequelize.STRING
//   },
//   location: {
//     type: Sequelize.STRING
//   },
//   price: {
//     type: Sequelize.STRING
//   },
//   url: {
//     type: Sequelize.STRING,
//     isUrl: true
//   },
//   photoUrl: {
//     type: Sequelize.STRING
//   },
//   category: {
//     type: Sequelize.STRING
//   }
// })

// const UserToEvent = () => {
//     console.log('Create the many to many table')
//     return User.belongsToMany(Event, {through: 'Users_Events', foreignKey: 'user_id', otherKey: 'event_id'})
// }


// sequelize.authenticate().then(() => {
//     console.log('Connection to MySQL Database Successful');

//     // force: true will drop the table if it already exists
//     return User.sync({force: true});
//     }).then(() => {
//       // Table created
//       return User.create({
//         displayName: 'John',
//         username: 'Hancock'
//       });
//     }).then(() => {
//       return Event.sync({force: true})
//     }).then(() => {
//       // Table created
//       return Event.create({
//         name: 'Golden State Warriors vs Los Angeles Lakers',
//         description: 'The most epic game of the season.'
//       });
//     }).then(() => {
//         return UserToEvent();
//     }).then(() => {
//       return Event.create({
//         name: 'HR Meetup'
//         description: 'Meet with HR friends!'
//         user_id
//       })
//     }).catch(error => {
//       console.log('Error with connection to database ', error)
//     })

// const Eventger = sequelize.define( 'Eventger Profile')
// module.exports = sequelize
