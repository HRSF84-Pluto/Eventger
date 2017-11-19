var Sequelize = require('sequelize');
var mysql = require('mysql');
var sequelize = new Sequelize({
  database: 'Eventger',
  username: 'root',
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});


// var connection = mysql.connection({
//   host: 'localhost',
//   user: 'root',
//   database: 'Eventger'
// })

// connection.connect((error) => {
//   if
// })

//Change the password and username -------------------------------------

sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL Database Successful');
    


    const User = sequelize.define('user', {
      // id: {
      //   type: Sequelize.INTEGER,
      //   autoIncrement: true,
      //   unique: true,
      //   primaryKey: true
      // },
      displayName: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
        // unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      }
    });

    // force: true will drop the table if it already exists
    User.sync({force: true}).then(() => {
      // Table created
      return User.create({
        displayName: 'John',
        username: 'Hancock'
      });
    }).catch((err) => {console.log('ERROR', err)});




  }).catch(error => {
    console.log('Error with connection to database ', error)
  })



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

// Event.sync({force: true}).then(() => {
//   // Table created
//   return Event.create({
//     name: 'Golden State Warriors vs Los Angeles Lakers',
//     description: 'The most epic game of the season.'
//   });
// });


// const Eventger = sequelize.define( 'Eventger Profile')



module.exports = sequelize;