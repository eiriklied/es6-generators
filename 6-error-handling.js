var co = require('co');
var get = require('./lib/get');

co(function* () {
  try {
    console.log('Starting requests');
    var responses = yield get('http://notfound.blabla');
    console.log('Requests done! vg: %j, db: %j', responses[0].headers.server, responses[1].headers.server);
  }
  catch (e) {
    console.log('Got error: %j for host %j', e.code, e.hostname);
  }
})()
