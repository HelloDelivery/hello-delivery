var SquareLib = require('square-connect');
var PostmatesLib = require('postmates');

var config = require('./config')

// Setup the square client
square = new SquareLib(config.apiKey);

module.exports = function () {
  console.log('connect');
};