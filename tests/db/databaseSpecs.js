//MAY NEED TO UPDATE USERNAME AND PASSWORD TO ACCESS MYSQL DATABASE

const expect = require('chai').expect;
const mysql = require('mysql');
const request = require('request');
const express = require('express');
const dbFuncs = require('../../db/db.js')
const app = express();

const schema = require('../../db/config.js');
const port = 3000;


describe('', function() {
  var db;
  var server;

  var clearDB = function(connection, tablenames, done) {
    var count = 0;
    tablenames.forEach(function(tablename) {
      connection.query('DROP TABLE IF EXISTS ' + tablename, function(err, result) {
        if (err) {console.log('ERROR', err)}
        console.log('DROPPED ' + tablename + ' ' + result);
        console.log(JSON.stringify(result));
        count++;
        console.log('count', count)
        console.log('Table length',tablenames.length)
        if (count === tablenames.length) {
          return schema(db).then(done);
        }
      });
    });
  };

  beforeEach(function(done) {

    db = mysql.createConnection({
      user: 'root',
      database: 'Eventger'
    });

    var tablenames = ['usersEvents', 'users', 'events'];

    db.connect(function(err) {
      if (err) { 
        console.log(err);
        return done(err); 
      }
      clearDB(db, tablenames, function() {
        server = app.listen(port, done);
      });
    });

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

  it('contains id, username, password, location columns', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd',
      location: '94102'
    };
    db.query('INSERT INTO users SET ?', newUser, function(err, results) {
      db.query('SELECT * FROM users WHERE username = ?', newUser.username, function(err, results) {
        var user = results[0];
        expect(user.username).to.exist;
        expect(user.password).to.exist;
        expect(user.id).to.exist;
        expect(user.location).to.exist;
        done();
      });
    });
  });

  it('only allows unique usernames', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd',
      location: '94102'
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
      id: 'ababab',
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
    var fakeEventArr = [fakeEvent.eventName, fakeEvent.date, fakeEvent.time, fakeEvent.location,
                        fakeEvent.price, fakeEvent.url, fakeEvent.photoUrl, fakeEvent.category]
    db.query('INSERT INTO events SET ?', fakeEvent, function(err, results) {
      if (err) {console.log('ERROR', err)}
      db.query('SELECT * FROM events WHERE eventName = ?', fakeEvent.eventName, function(err, results) {
        if (err) {console.log('ERROR', err)}
        var event = results[0];
        expect(event.id).to.exist;
        expect(event.eventName).to.exist;
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

  it('should have unique ids for each row provided by APIs', function(done) {
    var newEvent = {
      id: 'abcabc',
      eventName: 'Clippers vs Lakers',
      date: 'January 18, 2018',
    };
    newEventArr = [newEvent.id, newEvent.eventName, newEvent.date]
    db.query('INSERT INTO events (id, eventName, date) VALUES (?)', [newEventArr] , function(err, result) {
      if (err) {console.log(err)}
      var otherEvent = {
        id: 'abbbbb',
        eventName: 'Weeknd Concert',
        date: 'January 31, 2018'
      };
      otherEventArr = [otherEvent.id, otherEvent.eventName, otherEvent.date]
      db.query('INSERT INTO events (id, eventName, date) VALUES (?)', [otherEventArr], function(err, result) {
        if(err) {console.log(err)}
        db.query('SELECT id FROM events WHERE eventName=?', newEvent.eventName, function(error, results) {
          if(err) {console.log(err)}
          var eventId = results[0].id;
          expect(eventId).to.equal('abcabc');
          db.query('SELECT id FROM events WHERE eventName=?', otherEvent.eventName, function(err, results) {
            if(err) {console.log(err)}
            var eventId = results[0].id;
            expect(eventId).to.equal('abbbbb');
            done(error || err);
          });
        });
      });
    });
  });
});

describe('Helper Functions for Table users:', function() {
  it('saveUsernameAsync saves a new user', function(done) {
    var newUser = {
      id: 'aaaaa',
      username: 'Howard',
      password: 'p@ssw0rd',
      location: '94102'
    };
    // console.dir(dbFuncs.saveEvent)
    dbFuncs.saveUsernameAsync(newUser)
    .then((results) => {
      db.query('SELECT * FROM users WHERE username = ?', newUser.username, function(err, results) {
        var user = results[0];
        expect(user.id).to.equal(1);
        expect(user.username).to.equal('Howard');
        expect(user.password).to.equal('p@ssw0rd');
        expect(user.location).to.equal('94102');
        done();
      });
    });
  });

  it('findUsernameAsync finds a user', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd',
      location: '94102'
    };
    dbFuncs.saveUsernameAsync(newUser)
    .then(() => {
      dbFuncs.findUsernameAsync(newUser.username)
        .then((userData) => {
          expect(userData.username).to.equal('Howard');
          expect(userData.password).to.equal('p@ssw0rd');
          expect(userData.id).to.equal(1);
          expect(userData.location).to.equal('94102');
          done();
        });
      });
    });

  it('saveUsernameAsync only allows unique usernames', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd',
      zip: '94102'
    };
    dbFuncs.saveUsernameAsync(newUser).then(() => {
      var sameUser = newUser;
      dbFuncs.saveUsernameAsync(sameUser).catch((err) => {
        expect(err).to.exist;
        expect(err.code).to.equal('ER_DUP_ENTRY');
        done();
        })
      })
    });

  // it('saveEventAsync saves an event into the database', function(done) {
  // }

  // it('saveEventAsync saves events with unique ids', function(done) {
  // }

  // it('updatePreferencesAsync stores a new preference for the user ', function(done) {
  // }

  // it('updatePreferencesAsync stores only unique preference for the user ', function(done) {
  // }

  // it('findEventAsync finds a saved event', function(done) {
  // }
 
  // it('findEventAsync returns an error if saved event does not exist', function(done) {
  // }

  // it('findUserEventsAsync finds saved events of specified user', function(done) {
  // }

  // it('reduceSearchAsync selects up to two options for queryTermsForYelp ', function(done) {
  // }

  // it('reduceSearchAsync selects one option for preferenceForMusicOrLeague ', function(done) {
  // }

  // it('reduceSearchAsync includes preferences from the user in the queryTermsForYelp ', function(done) {
  // }

  });
});



