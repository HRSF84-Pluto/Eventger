const express = require('express');
const router = express.Router();
const db =  require('../db/db.js');

router.get('/', (req, res) => {
  console.log('is user authenticated?', req.isAuthenticated());
  req.session.destroy(function (err) {
    if (err){ res.status(304).json({status: "Unsuccessful logout"})}
    res.status(200).clearCookie('connect.sid').json({status: "Successful logout"});
  });
});

module.exports = router;
