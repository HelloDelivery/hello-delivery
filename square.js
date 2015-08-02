var Promise = require('bluebird');
var Square = Promise.promisifyAll(require('square-connect'));
var Postmates = Promise.promisifyAll(require('postmates'));
var Firebase = require('firebase');
var _ = require('lodash');
var config = require('./config');

// Setup the square client
var square = new Square(config.square.apiKey);
var postmates = new Postmates(config.customerId, config.apiKey)

// Setup merchant
console.log('hello')

// Entry point
module.exports = function (req, res) {
  // Get the square data
  var data = {}
  var event = req.body;

  // Get orders, payment

  // Create in firebase
  square.api('me/orders')
    .then(function (res) {

      // Load the orders
      var orders = res.body;

      // Load the order
      data.order = _.find(orders, { payment_id: event.entity_id })

      // Quote
      return postmates.quote({
        pickup_address: data.merchant.shipping_address,
        dropoff_address: data.order.shipping_address
      });

    }).then(function (res) {

      // Keep data reference
      data.quote = res.body;

      // We overpay
      if (data.order.total_shipping_money > data.quote.fee) {
        throw new Error('Overpay');
      }

      // Return the delivery
      return postmates.new({
        manifest: _.pluck(data.payment.itemizations, 'name').join(', '),
        pickup_name: data.merchant.business_name,
        pickup_address: data.merchant.shipping_address,
        pickup_phone_number: data.merchant.business_phone,
        pickup_business_name: data.merchant.business_name,
        dropoff_name: data.order.recipient_name,
        dropoff_address: data.order.shipping_address,
        dropoff_phone_number: data.order.recipient_phone_number,
        dropoff_notes: data.order.buyer_note,
        quote_id: data.quote.id
      });

    }).then(function (res) {
      var url = "https://hellodeliveries.firebaseio.com/orders/"
      var firebaseRef = new Firebase(url);
      firebaseRef.push(data);
    };
