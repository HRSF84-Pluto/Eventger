/**************************************************************************************/
/* TODO: Garrett feel free to use this if you would like! I was doing my tests for Server and saw this from shortly -BG */
/**************************************************************************************/

const expect = require('chai').expect;
const mysql = require('mysql');
const request = require('request');
const express = require('express');
var httpMocks = require('node-mocks-http');

const app = require('../server/app.js');
const schema = require('../server/db/config.js');
const port = 3000;

describe('', function() {
  var db;
  var server;

  var clearDB = function(connection, tablenames, done) {
    var count = 0;
    tablenames.forEach(function(tablename) {
      connection.query('DROP TABLE IF EXISTS ' + tablename, function() {
        count++;
        if (count === tablenames.length) {
          return schema(db).then(done);
        }
      });
    });
  };

  beforeEach(function(done) {

    /*************************************************************************************/
    /* TODO: Update user and password if different than on your local machine            */
    /*************************************************************************************/
    db = mysql.createConnection({
      user: 'student',
      password: 'student',
      database: 'shortly'
    });

    /**************************************************************************************/
    /* TODO: If you create a new MySQL tables, add it to the tablenames collection below. */
    /**************************************************************************************/
    var tablenames = ['links', 'clicks', 'users', 'sessions'];

    db.connect(function(err) {
      if (err) { return done(err); }
      /* Empties the db table before each test so that multiple tests
       * (or repeated runs of the tests) won't screw each other up: */
      clearDB(db, tablenames, function() {
        server = app.listen(port, done);
      });
    });

    afterEach(function() { server.close(); });
  });


  describe('Database Schema:', function() {
  it('contains a users table', function(done) {
    var queryString = 'SELECT * FROM users';
    db.query(queryString, function(err, results) {
      if (err) { return done(err); }

      expect(results).to.deep.equal([]);
      done();
    });
  });

  it('contains id, username, password columns', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd'
    };
    db.query('INSERT INTO users SET ?', newUser, function(err, results) {
      db.query('SELECT * FROM users WHERE username = ?', newUser.username, function(err, results) {
        var user = results[0];
        expect(user.username).to.exist;
        expect(user.password).to.exist;
        expect(user.id).to.exist;
        done();
      });
    });
  });

  it('only allows unique usernames', function(done) {
    var newUser = {
      username: 'Howard',
      password: 'p@ssw0rd'
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
