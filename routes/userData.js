const express = require('express');
const router = express.Router();
const db =  require('../db/db.js');



router.get('/', function(req, res) {
    const id = req.session.passport.user;
    console.log(id, "id in userData get");
     console.log('USER ID ', id);
    console.log("get user posting here///");
    db.findByIdAsync(id)
      .then(result => {
        db.findUsernameAsync(result.username)
          .then(result => res.status(200).json(result))
          .catch(err => res.status(404).end())
      }).catch(err => res.status(404).end())

});

module.exports = router;
