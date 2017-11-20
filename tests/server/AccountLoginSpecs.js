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

  describe('Account Login:', function() {

    beforeEach(function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/signup',
        'json': {
          'username': 'Samantha',
          'password': 'Samantha'
        }
      };

      request(options, function(error, res, body) {
        done(error);
      });
    });

    it('Logs in existing users', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/login',
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

    it('Users that do not exist are kept on login page', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/login',
        'json': {
          'username': 'Fred',
          'password': 'Fred'
        }
      };

      request(options, function(error, res, body) {
        if (error) { return done(error); }
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });

    it('Users that enter an incorrect password are kept on login page', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/login',
        'json': {
          'username': 'Samantha',
          'password': 'Alexander'
        }
      };

      request(options, function(error, res, body) {
        if (error) { return done(error); }
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });
  });
