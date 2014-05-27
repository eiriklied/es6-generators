var Q = require('q');
var request = Q.denodeify(require('request'));

// Just a utility to give us
var get = function(url) {
  return request(url).then(function(resultParams) {
    // Extract just the response object
    return resultParams[0];
  });
}

module.exports = get;
