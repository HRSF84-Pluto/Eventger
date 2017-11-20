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

describe('Account Creation:', function() {

    it('signup creates a new user record', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/signup',
        'json': {
          'username': 'Samantha',
          'password': 'Samantha'
        }
      };

      request(options, function(error, res, body) {
        var queryString = 'SELECT * FROM users where username = "Samantha"';
        db.query(queryString, function(err, rows) {
          if (err) { done(err); }
          var user = rows[0];
          expect(user).to.exist;
          expect(user.username).to.equal('Samantha');
          done();
        });
      });
    });

    it('does not store the user\'s original text password', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/signup',
        'json': {
          'username': 'Samantha',
          'password': 'Samantha'
        }
      };

      request(options, function(error, res, body) {
        if (error) { return done(error); }
        var queryString = 'SELECT password FROM users where username = "Samantha"';
        db.query(queryString, function(err, rows) {
          if (err) { return done (err); }
          var user = rows[0];
          expect(user.password).to.exist;
          expect(user.password).to.not.equal('Samantha');
          done();
        });
      });
    });

    it('redirects to signup if the user already exists', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/signup',
        'json': {
          'username': 'Samantha',
          'password': 'Samantha'
        }
      };

      request(options, function(error, res, body) {
        if (error) { return done(error); }
        request(options, function(err, response, resBody) {
          if (err) { return done(err); }
          expect(response.headers.location).to.equal('/signup');
          done();
        });
      });
    });

    it('redirects to index after user is created', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/signup',
        'json': {
          'username': 'Samantha',
          'password': 'Samantha'
        }
      };

      request(options, function(error, res, body) {
        if (error) { return done(error); }
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });
