var Firebase = require('firebase');
var config = require('./config');

module.exports = function (req, res) {

  // Data from the delivery
  var delivery = req.body.data;

  // Set the info to firebase
  var url = config.firebase.url + '/orders/' + delivery.id + '/delivery';
  var firebaseRef = new Firebase(url);
  firebaseRef.set(data);

  // Send the response
  res.send();
};