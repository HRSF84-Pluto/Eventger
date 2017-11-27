const express = require('express');
const router = express.Router();
const db =  require('../db/db.js');



router.get('/', function(req, res) {
  if (req.session.passport) {
    const id = req.session.passport.user;
    console.log(id, "id in userData get");
    console.log("get user posting here///");
    db.findUsernameAsync(null, id)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(404).end())
  }else {
    res.status(401).end();
  }
});

module.exports = router;
