const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const dataAgg = require('../api/dataAggregator.js');
const PORT = process.env.PORT || 3000;


app.listen(PORT, function () { console.log('Event-gers app listening on port 3000!') });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/')));
app.use(bodyParser.urlencoded({ extended: false }));

//Pulling new data when params change
app.get('/eventData', function (req, res) {
  dataAgg.finalResults('ADD PARAMS HERE',function(data) {
    res.send(data)
  });
});


//Add user to DB
app.post('/signup', function(req, res) {
  //req.body.userName
  // check DB if user exisits
    //If YES, then send back message that says
    //the user is already signed up
    //If NO, then add the user to DB
  //res.send(answer)
})


//Check to see if user is in DB, and return saved results
app.post('/login', function(req, res) {
  //req.body.userName
  // check DB if user exisits
    //If YES then return saved db results
    //If NO then return messsage that says
    //thye are not in our DB
  //res.send(answer)
})


/////**** this is repetitive******
// //Return saved Events to users
// app.post('/savedevents', function(req, res) {
//   //req.body.userName
//   //check DB if user exisits
//     //if YES, then return saved db results
//     //If NO, then return message taht says that
//     //they are not in our DB
//   //res.send(answer)
// })
