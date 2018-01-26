var Sequelize = require('sequelize');
var mysql = require('mysql');
var Promise = require('bluebird');
const createTables = require('./config');
const database = 'heroku_e67b3a46e336139';
//const database = 'Eventger';

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


//DATABASE_URL: mysql://ba3f260f7ba4c4:0e12068a@us-cdbr-iron-east-05.cleardb.net/heroku_e67b3a46e336139?reconnect=true

// var db = mysql.createConnection({
//   connectionLimit: 100,
//   host: 'us-cdbr-iron-east-05.cleardb.net' || process.env.DBSERVER ||'localhost',
//   user: 'ba3f260f7ba4c4' || process.env.DBUSER  ||'root',
//   database: 'heroku_e67b3a46e336139' || 'Eventger',
//   password: '0e12068a' || process.env.DBPASSWORD || ''
// });

var db = mysql.createPool({
  connectionLimit : 10,
  host:  'us-cdbr-iron-east-05.cleardb.net' ||'localhost',
  user: 'ba3f260f7ba4c4'||'root',
  database: database,
  password: '0e12068a'
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
    console.log(result)
    if (result[0] && result[0].preferences) {
      result[0].preferences = JSON.parse(result[0].preferences)
    }
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
    }
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
  if (!db.findUsernameAsync) {
    db = Promise.promisifyAll(db);
  }
  db.findUsernameAsync(null, userId)
  .then((userData) => {
    var userPrefArr = userData.preferences
    if (userPrefArr === null) {
        userPrefArr = [];
    } else if (userPrefArr.includes(category)) {
      callback(null, 'Category already exists in array');
      return;
    } else if (userPrefArr.length > 20) {
      userPrefArr.shift();
    }
    userPrefArr.push(category);
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
  if (!db.findEventAsync) {
    db = Promise.promisifyAll(db);
  }
  db.findEventAsync(eventId)
  .then((eventData) => {
    if (eventData){
      return db.updatePreferencesAsync(userId, eventData.category);
    }else{
      throw new Error('no eventData');
    }

  }).then(() => {
    var insertQuery = "INSERT INTO usersEvents (user_id, event_id) VALUES ?"
    var queryInput = [[userId, eventId]]

    db.query(insertQuery, [queryInput], function(err, result, fields) {
      if (err) {
        callback(err, null);
      };
      callback(null, result);
    });
  }).catch(err=> callback(err, null));
}


// sampleReqBody = {
//   queryTermForTM: ['sports', 'music'], // both query Terms are defined by homepage selection upon landing on site
//   preferenceForMusicOrLeague: ['Rock', 'Pop, 'Country'] // additional keyword given by user in preferences table [max: 1 word] to narrow down sports or music
//   queryTermForYelp: ['food', 'restaurants', 'club'] // default Yelp fetch from homepage
//   city: 'San Francisco',
//   postalCode: '94104',
//   startDateTime: '2017-01-12T18:00:00Z',
//   price: '$$',
// }

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

db.reduceSearch = (searchObj, userId, callback) => {
  if (!db.findUsernameAsync) {
    db = Promise.promisifyAll(db);
  }

  var narrowSearch = (queryTerms) => {
    var narrowedSearch = [];
    if (queryTerms.length > 2) {
      for (var i = 0; i < 2; i++) {
         var randomInt = getRandomInt(queryTerms.length)
         narrowedSearch.push(queryTerms[randomInt])
         queryTerms.splice(randomInt, 1);
      }
      return narrowedSearch;
    } else {
      return queryTerms;
    }
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

db.getConnectionAsync()
.then(() => console.log(`Connected to ${database} database`))
.then(() => db.queryAsync(`CREATE DATABASE IF NOT EXISTS ${database}`))
.then(() => db.queryAsync(`USE ${database}`))
.then(() => createTables(db))
.catch((err) => {if (err) console.log('ERROR with Connection', err)})
.then(() => {
})
////////End of the then after establishing connection - move around for testing


// //------------------------------Testing Updating Preferences---------------------------
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

// db.saveUsernameAsync(fakeUser, 'gasdfasdf')
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





    