var express = require('express');
var app = express();

var square = require('./square')
var postmates = require('./postmates')

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Listener to postmates
app.use('/postmates', postmates)
app.use('/square', square)

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


