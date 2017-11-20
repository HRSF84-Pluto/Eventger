var Sequelize = require('sequelize');
var mysql = require('mysql');
var Promise = require('bluebird');

// -- OBJECT Example
// -- User Object
// -- {
// --   username: string
// --   location: string with zipcode
// --   password: leave blank
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
  host: 'localhost',
  user: 'root',
  database: 'Eventger'
})

db.connect((err) => {if (err) console.log('ERROR with Connection', err)});

db.findUsername = (username, callback) => {
  var findQuery = "SELECT * FROM users WHERE (username=?)";
  var queryInput = username;
  db.query(findQuery, [queryInput], function(err, result, fields) {
    if (err) {
      callback(err, null);
    };
    callback(null, result[0]);
  })
};

db.saveUsername = (userObj, callback) => {
  var insertQuery = "INSERT INTO users (username, password, location) VALUES ?";
  var queryInput = [[ userObj.username, userObj.password, userObj.location ]]
  db.query(insertQuery, [queryInput], function(err, result, fields) {
    if (err) {
      callback(err, null);
    };
    callback(null, result);
  })
}


module.exports = Promise.promisifyAll(db);

// db.connect((error) => {
//   if (error) {console.log('ERROR', error)}

//   var userInsert = "INSERT INTO users (username, location, password) VALUES ?";
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
//                         db.saveUsername({username: 'Gman', password: '', location: 'the BAY'}, (data) => {
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


//-------------ASYNC TESTING ONLY WORKS IF INCLUDED AFTER EXPORT STATEMENT---------------------
// db.saveUsernameAsync({username: 'Jarvis', password: '', location: 'the BAY'})
//     .then(() => {
//       return db.findUsernameAsync('Mickey')
//     }).then((data) => {
//         console.log('Mission Complete!', data)
//     }).catch((err) => {
//         console.log('Mission Failed!', err)
//     })


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
