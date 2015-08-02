var express = require('express');
var app = express();

var square = require('./square')
var postmates = require('./postmates')

app.set('port', (process.env.PORT || 5000));

// Listener to postmates
app.post('/postmates', postmates)
app.post('/square', square)

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


