var Firebase = require('firebase');
var config = require('./config');

module.exports = function (req, res) {

  // Data from the delivery
  var delivery = req.body.data;

  // Set the info to firebase
  var url = config.firebase.url + '/orders/' + delivery.id;
  var firebaseRef = new Firebase(url);

  // Setup the current status
  var deliveryRef = firebaseRef.child('delivery');
  deliveryRef.set(delivery);

  // Setup the history
  var deliveryHistoryRef = firebaseRef.child('delivery_history');
  deliveryHistoryRef.push(delivery);

  // Send the response
  res.send();
};