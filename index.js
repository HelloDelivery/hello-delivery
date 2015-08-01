var express = require('express');
var app = express();
var connect = require('./connect')
var post = require('./post')

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Connect
connect();

// Listener to postmates
app.post('/postmates', post)

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


