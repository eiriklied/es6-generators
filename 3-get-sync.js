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
  for(var i=0; i<urls.length; i++) {
    var response = yield get(urls[i]);
    console.log(urls[i] + ' uses ' + response.headers.server);
  }
})()
