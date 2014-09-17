var co = require('co');
var get = require('./lib/get');

co(function* () {
  console.log('Starting requests');
  var responses = yield [get('http://www.vg.no'), get('http://www.db.no')];
  console.log('Requests done! vg: %j, db: %j', responses[0].headers.server, responses[1].headers.server);
})()
