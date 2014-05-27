var co  = require('co');
var get = require('./lib/get');

var urls = [
'http://www.vg.no',
'http://www.dagbladet.no',
'http://www.aftenposten.no',
'http://www.morgenbladet.no',
'http://www.klassekampen.no',
'http://www.budstikka.no',
'http://www.sandefjords-blad.no',
'http://www.dagsavisen.no'
]

co(function* (){
  var requests = urls.map(get);
  var responses = yield requests;

  for(i=0; i<urls.length; i++) {
    console.log(urls[i] + ' uses ' + responses[i].headers.server);
  }
})();
