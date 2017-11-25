const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db =  require('../db/db.js');


//Add user to DB
router.post('/', function(req, res) {
  //Save user
  console.log('inside signup route', req.body);
  //generates salt
  bcrypt.genSalt(saltRounds, function(err, salt) {
    //generates hash
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (hash){
        db.saveUsernameAsync(req.body, hash)
          .then((results) => res.status(201).send(true))
          //will send message if already in DB
          .catch((err)=> {
            console.log(err);
            res.status(409).send(false)
          })
      }else{
        console.log('error in creating hash, inside routes/signup');
      }
    });
  });

});

module.exports = router;
