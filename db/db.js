var Sequelize = require('sequelize');
var mysql = require('mysql');
var sequelize = new Sequelize('Eventger') {
  username: 'root',
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
}


var connection = mysql.connection({
  host: 'localhost',
  user: 'root',
  database: 'Eventger'
})

// connection.connect((error) => {
//   if
// })

//Change the password and username -------------------------------------

// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection to MySQL Database Successful');
//   }.catch(error => {
//     console.log('Error with connection to database ', error)
//   })


// const Eventger = sequelize.define( 'Eventger Profile')



module.exports = connection;