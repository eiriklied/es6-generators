var co = require('co');
var get = require('./lib/get');

co(function* () {
  try {
    console.log('Starting requests');
    var responses = yield [get('http://notfound.blabla'), get('http://www.bekk.no')];
    console.log('Requests done! notfound: %j, bekk: %j', responses[0].headers.server, responses[1].headers.server);
  }
  catch (e) {
    console.log('Got error: %j for host %j', e.code, e.hostname);
  }
})()
