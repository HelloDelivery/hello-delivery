var Firebase = require('firebase');
var config = require('./config');

module.exports = function (req, res) {

  // Data from the delivery
  var delivery = req.body.data;

  // Set the info to firebase
  var url = config.firebase.url + '/orders/' + delivery.id + '/delivery_history';
  var firebaseRef = new Firebase(url);
  firebaseRef.push(delivery);

  // Send the response
  res.send();
};