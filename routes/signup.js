const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db =  require('../db/db.js');


//Add user to DB
router.post('/', function(req, res) {
  if (req.body.username === 'Login'){
    res.status(403).send();
  }
  //bcrypt is a hashing library
  //bcrypt generates salt
  bcrypt.genSalt(saltRounds, function(err, salt) {
    //bcrypt generates hash
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if(err){console.log('error in creating hash, inside routes/signup');}
        db.saveUsernameAsync(req.body, hash)
          .then((results) => res.status(201).send(true))
          .catch((err)=> {
            console.log(err);
            res.status(409).send(false)
          })
    });
  });

});

module.exports = router;
