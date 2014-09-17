var co = require('co');
var get = require('./lib/get');

co(function* () {
  console.log('Starting request');
  var response = yield get('http://www.vg.no');
  console.log('Request done! Server: %j', response.headers.server);
})()
