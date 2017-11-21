/**************************************************************************************/
/* TODO: Garrett feel free to use this if you would like! I was doing my tests for Server and saw this from shortly -BG */
/**************************************************************************************/

const expect = require('chai').expect;
const mysql = require('mysql');
const request = require('request');
const express = require('express');
// var httpMocks = require('node-mocks-http');
// const dbFuncs = require('../../db/db.js')
const app = express();
// const app = require('../../server/index.js');

const schema = require('../../db/config.js');
const port = 3000;


describe('', function() {
  // var db;
  var server;

  var clearDB = function(connection, tablenames, done) {
    var count = 0;
    tablenames.forEach(function(tablename) {
      connection.query('DROP TABLE IF EXISTS ' + tablename, function() {
        console.log('DROPPED ' + tablename);
        count++;
        if (count === tablenames.length) {
          return schema(db).then(done);
          done();
        }
      });
    });
  };

  beforeEach(function(done) {

    /*************************************************************************************/
    /* TODO: Update user and password if different than on your local machine            */
    /*************************************************************************************/
    db = mysql.createConnection({
      user: 'root',
      database: 'Eventger'
    });

    /**************************************************************************************/
    /* TODO: If you create a new MySQL tables, add it to the tablenames collection below. */
    /**************************************************************************************/
    var tablenames = ['users', 'usersEvents', 'events'];

    // db.connect(function(err) {
    //   if (err) { 
    //     console.log(err);
    //     return done(err); 
    //   }
      console.log('INTO BEFORE EACH');
      /* Empties the db table before each test so that multiple tests
       * (or repeated runs of the tests) won't screw each other up: */
      clearDB(db, tablenames, function() {
        console.log('Cleared the DB');
        server = app.listen(port, done);
      });
    // });

    afterEach(function() { server.close(); });
  });


  describe('Database Table Schema for users:', function() {
  it('contains a users table', function(done) {
    var queryString = 'SELECT * FROM users';
    db.query(queryString, function(err, results) {
      if (err) { return done(err); }

      expect(results).to.deep.equal([]);
      done();
    });
  });

  it('contains id, username, password, zip columns', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd',
      zip: '94102'
    };
    db.query('INSERT INTO users SET ?', newUser, function(err, results) {
      db.query('SELECT * FROM users WHERE username = ?', newUser.username, function(err, results) {
        var user = results[0];
        expect(user.username).to.exist;
        expect(user.password).to.exist;
        expect(user.id).to.exist;
        expect(user.zip).to.exist;
        done();
      });
    });
  });

  it('only allows unique usernames', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd',
      zip: '94102'
    };
    db.query('INSERT INTO users SET ?', newUser, function(err, results) {
      var sameUser = newUser;
      db.query('INSERT INTO users SET ?', sameUser, function(err) {
        expect(err).to.exist;
        expect(err.code).to.equal('ER_DUP_ENTRY');
        done();
      });
    });
  });

  it('should increment the id of new rows', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd'
    };
    db.query('INSERT INTO users SET ?', newUser, function(error, result) {
      var newUserId = result.insertId;
      var otherUser = {
        username: 'Muhammed',
        password: 'p@ssw0rd'
      };
      db.query('INSERT INTO users SET ?', otherUser, function(err, results) {
        var userId = results.insertId;
        expect(userId).to.equal(newUserId + 1);
        done(error || err);
      });
    });
  });
});


describe('Database Table Schema for events:', function() {
  it('contains a events table', function(done) {
    var queryString = 'SELECT * FROM events';
    db.query(queryString, function(err, results) {
      if (err) { return done(err); }

      expect(results).to.deep.equal([]);
      done();
    });
  });

  it('contains id, eventName, data, time, location, price, url, photoUrl, category columns', function(done) {
    var fakeEvent = {
      eventName: 'Blink 182 Concert',
      date: 'January 18, 2018',
      time: '4:00pm',
      location: "{ \
          line_1: '1080 Folsom St', \
          city: 'San Francisco', \
          state: 'CA', \
          zip: '94102' \
      }",
      price: '$50.00',
      url: 'https://www.ticketmaster.com/Blink-182-tickets/artist/790708',
      photoUrl: 'https://s1.ticketm.net/tm/en-us/dam/a/9ec/f80aa88d-71fb-4b5f-955c-a3a3e87109ec_118051_CUSTOM.jpg',
      category: 'music'
    }
    db.query('INSERT INTO events SET ?', fakeEvent, function(err, results) {
      db.query('SELECT * FROM events WHERE eventName = ?', fakeEvent.eventName, function(err, results) {
        var event = results[0];
        expect(event.eventName).to.exist
        expect(event.date).to.exist;
        expect(event.time).to.exist;
        expect(event.location).to.exist;
        expect(event.price).to.exist;
        expect(event.url).to.exist;
        expect(event.photoUrl).to.exist;
        expect(event.category).to.exist;
        done();
      });
    });
  });

  // it('only allows unique usernames', function(done) {
  //   var newUser = {
  //     username: 'Howard',
  //     password: 'p@ssw0rd',
  //     zip: '94102'
  //   };
  //   db.query('INSERT INTO users SET ?', newUser, function(err, results) {
  //     var sameUser = newUser;
  //     db.query('INSERT INTO users SET ?', sameUser, function(err) {
  //       expect(err).to.exist;
  //       expect(err.code).to.equal('ER_DUP_ENTRY');
  //       done();
  //     });
  //   });
  // });

  it('should increment the id of new rows', function(done) {
    var newEvent = {
      eventName: 'Clippers vs Lakers',
      date: 'January 18, 2018'
    };
    db.query('INSERT INTO events SET ?', newEvent, function(error, result) {
      var newEventId = result.insertId;
      var otherEvent = {
        eventName: 'Weeknd Concert',
        date: 'January 31, 2018'
      };
      db.query('INSERT INTO events SET ?', otherEvent, function(err, results) {
        var eventId = results.insertId;
        expect(userId).to.equal(newUserId + 1);
        done(error || err);
      });
    });
  });
});

describe('Helper Functions for Table users:', function() {
  it('saveUserAsync saves a new user', function(done) {
    var newUser = {
      id: 'aaaaa',
      username: 'Howard',
      password: 'p@ssw0rd',
      zip: '94102'
    };
    db.saveUserAsync(newUser)
    .then((results) => {
      db.query('SELECT * FROM users WHERE username = ?', newUser.username, function(err, results) {
        var user = results[0];
        expect(user.id).to.equal(1);
        expect(user.username).to.equal('Howard');
        expect(user.password).to.equal('p@ssw0rd');
        expect(user.zip).to.equal('94102');
        done();
      });
    });
  });

  it('findUserAsync finds a user', function(done) {
    var newUser = 'Howard'
    db.findUserAsync(newUser).then((userData) => {
      expect(userData.username).to.equal('Howard');
      expect(userData.password).to.equal('p@ssw0rd');
      expect(userData.id).to.equal('aaaaa');
      expect(userData.zip).to.equal('94102');
      done();
    });
  });

  it('saveUserAsync only allows unique usernames', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd',
      zip: '94102'
    };
    db.query('INSERT INTO users SET ?', newUser, function(err, results) {
      var sameUser = newUser;
      db.query('INSERT INTO users SET ?', sameUser, function(err) {
        expect(err).to.exist;
        expect(err.code).to.equal('ER_DUP_ENTRY');
        done();
      });
    });
  });
});
});
