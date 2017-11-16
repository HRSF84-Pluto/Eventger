const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const yelp = require('../api/yelp.js');
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () { console.log('Event-gers app listening on port 3000!') });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/')));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/testYelp', function (req, res) {
  yelp.getYelpResults()
  res.send('GET request to the homepage')
})
