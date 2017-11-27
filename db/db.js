var Sequelize = require('sequelize');
var mysql = require('mysql');
var Promise = require('bluebird');
const createTables = require('./config');

// -- OBJECT Examples
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


////USE THESE CREDENTIALS FOR TESTING ON LOCAL MACHINE, CHANGE AS NECESSARY
// const database = 'Eventger';
// var db = mysql.createConnection({
//   host: process.env.DBSERVER ||'localhost',
//   user: process.env.DBUSER  ||'root',
//   database: 'Eventger',
//   password: process.env.DBPASSWORD || ''
// });


//USE FOR TESTING WITH STAGING CLEARDB
//DATABASE_URL: mysql://ba3f260f7ba4c4:0e12068a@us-cdbr-iron-east-05.cleardb.net/heroku_e67b3a46e336139?reconnect=true
const database = 'heroku_e67b3a46e336139';
var db = mysql.createConnection({
  host: 'us-cdbr-iron-east-05.cleardb.net',
  user: 'ba3f260f7ba4c4',
  database: 'heroku_e67b3a46e336139',
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

  db.query(findQuery, [queryInput], function(err, results) {
    if (err) {
      callback(err, null);
    }
    if (results[0] && results[0].preferences) {
      results[0].preferences = JSON.parse(results[0].preferences);
    }
    callback(null, results[0]);
  })
};

db.getHash = (username, callback) => {
  var findQuery = "SELECT hash FROM users WHERE (username=?)";
  var queryInput = username;
  db.query(findQuery, [queryInput], function(err, results) {
    console.log("result inside get hash", results[0].hash);
    if (err) {
      callback(err, null);
    }
    callback(null, results[0].hash);
  })
};

db.saveUsername = (userObj, callback) => {
  console.log(' hash inside saveUsername', userObj.hash);
  var insertQuery = "INSERT INTO users (username, password, location, hash) VALUES ?";
  var queryInput = [[ userObj.username, userObj.password, userObj.location, userObj.hash ]]
  db.query(insertQuery, [queryInput], function(err, result) {
    if (err) {
      callback(err, null);
    }
    callback(null, result);
  })
}

db.findEvent = (id, callback) => {
  var findQuery = "SELECT * FROM events WHERE (id=?)";
  var queryInput = id;
  db.query(findQuery, [queryInput], function(err, results) {
    if (err) {
      callback(err, null);
    }
    callback(null, results[0]);
  })
};

db.findUserEvents = (username, callback) => {
  var findQuery = "SELECT events.id, eventName, date, time, events.location, price, url, photoUrl, category \
                   FROM events INNER JOIN usersEvents INNER JOIN users \
                   WHERE events.id=usersEvents.event_id \
                   AND usersEvents.user_id=users.id \
                   AND (users.username=?)";
  var queryInput = username;
  db.query(findQuery, [queryInput], function(err, results) {
    if (err) {
      callback(err, null);
    }
    if(results !== undefined) {
      results.map(result => {
        result.location = JSON.parse(result.location);
      });
    }
    callback(null, results);
  })
};

db.saveEvent = (eventObj, callback) => {
  var insertQuery = "INSERT INTO events SET ?";
  eventObj.location = JSON.stringify(eventObj.location)
  db.query(insertQuery, eventObj, function(err, result) {
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
  .then(userData => {
    var userPrefArr = userData.preferences;
    if (userPrefArr === null) {
        userPrefArr = [];
    } else if (userPrefArr.includes(category)) {
      callback(null, 'Category already exists in array');
      return;
    } else if (userPrefArr.length > 20) {
      userPrefArr.shift();
    }
    userPrefArr.push(category);
    var updateQuery = "UPDATE users SET preferences= ? WHERE id= ?";
    var queryInput = [JSON.stringify(userPrefArr), userId];
    db.query(updateQuery, queryInput, function(err, result) {
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
  .then(eventData => {
    if (eventData){
      return db.updatePreferencesAsync(userId, eventData.category);
    }else{
      throw new Error('no eventData');
    }
  }).then(() => {
    var insertQuery = "INSERT INTO usersEvents (user_id, event_id) VALUES ?";
    var queryInput = [[userId, eventId]];
    db.query(insertQuery, [queryInput], function(err, result) {
      if (err) {
        callback(err, null);
      };
      callback(null, result);
    });
  }).catch(err => callback(err, null));
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

// sampleReqBody = {
//   queryTermForTM: ['sports', 'music'],
//   preferenceForMusicOrLeague: ['Rock', 'Pop, 'Country'] 
//   queryTermForYelp: ['food', 'restaurants', 'club'] 
//   city: 'San Francisco',
//   postalCode: '94104',
//   startDateTime: '2017-01-12T18:00:00Z',
//   price: '$$',
// }

//Reduces the preferenceForMusicOrLeague to an array of one and reduces the queryTermForYelp to an array of two
db.reduceSearch = (searchObj, userId, callback) => {
  var selectRandomUpTo = (queryTerms, n) => {
    var narrowedSearch = [];
    if (queryTerms.length > n) {
      for (var i = 0; i < n; i++) {
         var randomInt = getRandomInt(queryTerms.length);
         narrowedSearch.push(queryTerms[randomInt]);
         queryTerms.splice(randomInt, 1);
      }
      return narrowedSearch;
    } else {
      return queryTerms;
    }
  }

  if (!db.findUsernameAsync) {
    db = Promise.promisifyAll(db);
  }
  if (userId) {
     db.findUsernameAsync(null, userId)
     .then(userData => {
       searchObj.queryTermForYelp = searchObj.queryTermForYelp.concat(userData.preferences);
       searchObj.queryTermForYelp = selectRandomUpTo(searchObj.queryTermForYelp, 2);
     })
     .catch(err => callback(err, null))
     .then(() => {
        if (searchObj.preferenceForMusicOrLeague.length > 1) {
          searchObj.preferenceForMusicOrLeague = [searchObj.preferenceForMusicOrLeague[getRandomInt(searchObj.preferenceForMusicOrLeague.length)]];
        }
        callback(null, searchObj);
     })
  } else {
     searchObj.queryTermForYelp = selectRandomUpTo(searchObj.queryTermForYelp, 2);
     if (searchObj.preferenceForMusicOrLeague.length > 1) {
      searchObj.preferenceForMusicOrLeague = [searchObj.preferenceForMusicOrLeague[getRandomInt(searchObj.preferenceForMusicOrLeague.length)]];
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
.catch(err => {if (err) console.log('ERROR with Connection', err)})
.then(() => {
})////////End of the then after establishing connection - move around for testing



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

