var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var Postmates = require('postmates');
var Firebase = require('firebase');
var _ = require('lodash');
var phoneFormatter = require('phone-formatter');
var config = require('./config');

// Setup the square client
var postmates = Promise.promisifyAll(new Postmates(config.postmates.customerId, config.postmates.apiKey));

// Stringify shipping address
var stringifyAddress = function (address) {
  return _.chain(address)
    .pick(_.identity)
    .values()
    .join(', ')
    .value();
}

var formatNumber = function (number, format) {
  format = format || '(NNN) NNN-NNNN';
  if (_.isObject(number)) {
    number = _.values(number).join();
  }
  return phoneFormatter.format(number, format);
}

// Entry point
module.exports = function (req, res) {
  // Get the square data
  var data = {}
  var event = req.body;

  var square = function(url) {
    return request.getAsync('https://connect.squareup.com/v1/' + url, {
      'auth': {
        'bearer': config.square.apiKey
      },
      json: true
    });
  }

  // Get orders, payment, merchant
  Promise.props({
    orders: square('me/orders'),
    payment: square('me/payments/' + event.entity_id),
    merchant: square('me')
  }).then(function (response) {

      // Load the orders
      var orders = _.first(response.orders).body;

      // Load the order
      data.order = _.find(orders, { payment_id: event.entity_id })
      data.merchant = _.first(response.merchant).body;
      data.payment = _.first(response.payment).body;

      // Quote
      return postmates.quoteAsync({
        pickup_address: stringifyAddress(data.merchant.shipping_address),
        dropoff_address: stringifyAddress(data.order.shipping_address)
      });

    }).then(function (response) {

      // Keep data reference
      data.quote = response.body;

      // We overpay
      /*if (data.order.total_shipping_money > data.quote.fee) {
        throw new Error('Overpay');
      }*/

      // Return the delivery
      return postmates.newAsync({
        manifest: _.pluck(data.payment.itemizations, 'name').join(', '),
        pickup_name: data.merchant.business_name,
        pickup_address: stringifyAddress(data.merchant.shipping_address),
        pickup_phone_number: formatNumber(data.merchant.business_phone),
        pickup_business_name: data.merchant.business_name,
        dropoff_name: data.order.recipient_name,
        dropoff_address: stringifyAddress(data.order.shipping_address),
        dropoff_phone_number: formatNumber(data.order.recipient_phone_number),
        dropoff_notes: data.order.buyer_note,
        quote_id: data.quote.id,
        robo_pickup: "00:02:00",
        robo_pickup_complete: "00:03:00",
        robo_dropoff: "00:04:00",
        robo_delivered: "00:05:00"
      });

    }).then(function (response) {

      // Delivery info
      data.delivery = response.body;
      data.delivery_history = [data.delivery];

      var url = config.firebase.url + '/orders/' + data.delivery.id;
      var firebaseRef = new Firebase(url);
      firebaseRef.set(data);

      // Send the response
      res.send()
    });
};
