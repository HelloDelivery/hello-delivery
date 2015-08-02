var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var square = require('./square')
var postmates = require('./postmates')

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Listener to postmates
app.post('/postmates', postmates)
app.post('/square', square)

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
