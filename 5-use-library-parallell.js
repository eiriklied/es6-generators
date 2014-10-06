var co = require('co');
var get = require('./lib/get');

co(function* () {
  console.log('Starting requests');
  var responses = yield [get('http://www.bekk.no'), get('http://www.google.no')];
  console.log('Requests done! bekk: %j, google: %j', responses[0].headers.server, responses[1].headers.server);
})()
