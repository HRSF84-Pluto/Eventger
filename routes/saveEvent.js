const express = require('express');
const router = express.Router();
const db =  require('../db/db.js');
const $ = require('jquery');

router.post('/', (req, res) => {
  console.log("inside POST saveEvent");
    const events = JSON.parse(req.body.events);

    //Get user ID
    db.findUsernameAsync(req.body.username, null)
      .then(results => {
        const userId = results.id;
        //For Each event in array list, save to DB
        events.forEach(event => {
          //First check if event is saved to Events table
          db.findEventAsync(event.id)
            .then(results => {
              //If event is not in Events table, save it to Events table
              if (!results) {
                db.saveEventAsync(event)
                  .then(results => console.log('Save event into Event DB: ', results))
                  .catch(err => console.log(err, "event not saved"));
              } //Save eventId and userId to UserEvent table
              db.saveUserEventAsync(userId, event.id)
                .then(results => res.status(201).send('Your Data has been saved!'))
                .catch(err => res.status(406).end())
            })
            .catch(err => console.error(err))
        });
      })
      .catch(err => console.error(err))
});

router.get('/', (req, res) => {
  console.log("inside GET SAVE EVENT", req.url);
  //find current user
  let username = req.url.split('?');

  username = username.pop();
  console.log(username, "IS THIS USERNAME???");
 db.findUserEventsAsync(username)
   .then(events=> res.status(200).json(events))
   .catch(err=> res.status(404).end());

});

module.exports = router;
