const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.listen(3000, function () { console.log('Event-gers app listening on port 3000!') });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
