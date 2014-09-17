var get = require('./lib/get');

function *findServer(){
  console.log('Starting request');
  var response = yield get('http://www.vg.no');
  console.log('Request done! Server: %j', response.headers.server);
}


var requestsGenerator = findServer();
// start generator and get the yielded value which is a promise
var promise = requestsGenerator.next().value;
promise.then(function(result) {
  var status = requestsGenerator.next(result);
});
