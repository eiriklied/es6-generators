# Generators

> a beginners guide

Note:  
All examples shown here can be run with the newest version of node (0.11.14 as
of September 2014). To activate the ES6 (Harmony) features, start node with the
`--harmony` flag when running the examples. All example code can be found on
[github](https://github.com/eiriklied/es6-generators).


## What are generators?

A generator looks very much like a function, but its annotated with an extra `*`.

The inside of the generator is just like regular JavaScript except for one thing.
You can use the keyword `yield` in front of any expression.

```javascript
function *myRandomNumbers() {
  console.log("myRandomNumbers starting!");
  yield 2;
  yield 3;
  return 4;
}
```

After defining a generator like `myRandomNumbers` above, you can call it like
a function. However, calling `myRandomNumbers()` will not run the generator,
it will return a `Generator` object.

This `Generator` object will give you a method to call: `next()`. _Note that
there are some more methods you can call, but we wont go into them now._

When you call `next()` on the generator-object, the generator code will start
executing, printing `myRandomNumbers starting!` until it comes to its first `yield` expression. Here, `next()` will
return an object containg two things

- `value`: the value of the yielded expression
- `done`: a flag telling us wether the generator is done running;

If you call `next()` again, the generator will continue to execute from where
it stopped until it reaches a new `yield`, and `next()` will return with the
freshly yielded value again.

Lets run the `myRandomNumbers` generator from above and see what we get:

```javascript
var generatorObj = myRandomNumbers();   // returning: [object Generator]
var returned = generatorObj.next();     // printing:  'myRandomNumbers starting!'
                                        // returning: { value: 2, done: false }
returned = generatorObj.next();         // returning: { value: 3, done: false }
returned = generatorObj.next();         // returning: { value: 4, done: true }
```

## Iterating

So this is pretty nice, we can now create generator objects and they kind of
behave like iterators since you call `next()` on them. In fact, lets create an
iterator.

Lets say you want to iterate over a laaarge set of even numbers, but
creating a huge array to loop over would just take too much memory. Now you can
create a generator creating even numbers on the fly.

```javascript
function *even(from, to) {
  var current = from;
  while(current <= to) {
    yield current;
    current = current + 2;
  }
}

// Note that we are not calling next() on the generator,
// in ECMAScript 6 the for contruct will do this for us
// on each iteration
for(number of even(2, 1000000)) {
  console.log(number)
}

// Will output:
//
// 2
// 4
// 6
// .
// ..
// ...
// 999998
// 1000000

```


## Control flow

Even though generators can be used to create advanced iterators, I don't think
that is where they will make the biggest change. However, a huge win of
generators is how you can control the flow of your application.

Let's give this a try using promises.

```javascript
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

// Will output:
//
// Starting request
// Request done! Server: "Apache/2.2.15 (CentOS)"
```

In the example above I use a utility function `get` that performs an http get
request and returns a promise. Since we `yield` the promise, we can fetch the
promise when calling `next()` on the generator object. After the promise has
been fulfilled, we can call `next(result)` again, and the generator receives the
result as a return value from the `yield`.

Most of the code in the example above is not very interesting. What is really
interesting though, is that _the code in the generator looks completely
synchronous_ even though it is not! Since its a generator, the code is just
pausing execution at the `yield`.

Promises did a great job helping us with nested callbacks when doing async
programming, but generators can take this to a new level.

## Use a library

Luckily, there are already some great libraries in place to help us with
fulfilling promises, so we can focus on the code that actually does what we want.

Lets rewrite the previous example using the [co](https://github.com/visionmedia/co)
library so we can focus on the get requests.

```javascript
var co = require('co');
var get = require('./lib/get');

co(function* () {
  console.log('Starting request');
  var response = yield get('http://www.vg.no');
  console.log('Request done! Server: %j', response.headers.server);
})()

// Will output
// Starting request
// Request done! Server: "Apache/2.2.15 (CentOS)"
```

And it doesn't stop there! Why not make a couple of requests in parallell:

```javascript
var co = require('co');
var get = require('./lib/get');

co(function* () {
  console.log('Starting requests');
  var responses = yield [get('http://www.vg.no'), get('http://www.db.no')];
  console.log('Requests done! vg: %j, db: %j', responses[0].headers.server, responses[1].headers.server);
})()

// Will output
// Starting requests
// Requests done! vg: "Apache/2.2.15 (CentOS)", db: "Apache/2.2.27"

```

This is just `co` doing all the heavy lifting. We pass an array of promises to
yield and we get an array of fullfilled promises back. Requests run in parallell,
but still the code has no callbacks!

## Exceptions

So what to do when we get exceptional behaviour, like a failed http-request?
This is really up to the code that runs the generator to handle, but exceptions
can bubble back to the generator. This means we will get some pretty familiar
looking code when adding some error handling. Again, lets look at an example
with co.

```javascript
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

// Will output
// Starting requests
// Got error: "ENOTFOUND" for host "notfound.blabla"
```

So we actually end up having synchronous looking code, with familiar error
handling! So, any reason not to start using this today?

## Support

Node 0.11 supports generators when running with the `--harmony` flag.

Firefox and Chrome already support generators natively. To run them in all
browsers (and you probably will), you can use a transpiler like
[traceur](https://github.com/google/traceur-compiler) or
[regenerator](https://github.com/facebook/regenerator).
