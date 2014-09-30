# Generators

> from nothing to... something

## What are generators?

Generators are coming in ECMAScript 6 and despite the name they look almost
identical to functions, with two small differences.

1. The generator is declarated like a function, only its annotated with an
extra `*`.
1. Inside the generator you can use the keyword `yield` in front of any
expression.

```javascript
function *myRandomNumbers() {
  console.log("myRandomNumbers starting!");
  yield 2;
  yield 3;
  return 4;
}
```

After defining a generator like `myRandomNumbers` above, you can call it like
a function. However, calling `myRandomNumbers()` will not run the code inside the
generator like a normal function call would do. Instead it will return a
`Generator` object.

This `Generator` object will give you a method to call: `next()`. _Note that
there are some more methods you can call, but we will come back to that later._

When you call `next()` on the generator-object, the generator code will start
executing, printing `myRandomNumbers starting!` until it comes to its first `yield` expression. Here, `next()` will
return an object containing two things:

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
iterator!

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
// in ECMAScript 6 the for construct will do this for us
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

Even though generators can be used to create advanced iterators, it's not their
biggest sweet spot. The coolest thing about generators is how you
can control the flow of your application.

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

Promises did a great job helping us against nested callback hell when doing async
programming, but generators takes this to a whole new level.

## Use a library

Luckily, there are already some great libraries in place to help us with
fulfilling promises and handling callbacks, so we can focus on the code that
matters to us.

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
but still there is not a single callback in our code!

## Exceptions

So what to do when we get exceptional behaviour, like a failed http-request in
the example above? The code that runs the generator is in a position to do
whatever it finds suitable. If we find it necessary, we can trigger an exception
at the yield call inside the generator. This is done using a `throw` method we
cab call on the generator object. Let's have a look at how this works:

```javascript
function *performSomethingExceptional(){
  console.log('Starting generator');
  try {
    yield 2
    console.log('Done with exceptional yield!');
  }
  catch (e) {
    console.log("Got exception! %j", e);
  }
}

var generatorObject = performSomethingExceptional();
// start generator so the generator pauses at 'yield'
generatorObject.next();
// now make the generator throw an exception at the yield
// inside the generator!
generatorObject.throw("My custom thrown exception");

// Will output
// Starting generator
// Got exception! "My custom thrown exception"

```

Of course this example doesn't do much of use, but looking at the code inside
the generator, we can see that the exeption handling looks very familiar, and
still, we have no callbacks inside the generator!

The [co](https://github.com/visionmedia/co) library we used earlier does exactly
what it should do when it comes to handling exceptions. Lets look at an example
with a failing http request:

```javascript
var co = require('co');
var get = require('./lib/get');

co(function* () {
  try {
    console.log('Starting requests');
    var responses = yield [get('http://notfound.blabla'), get('http://db.no')];
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

So now we make asynchronous http requests in parallel, we have synchronous
looking code, and we even have familiar exception handling! IS THIS GREAT OR
WHAT??

Phew! So with this we have covered quite a bit. Don't worry if you didn't follow
100% on every example. Just remember that generators are not magic, but they
can do magic for our callback-based code!

## Found in..

So this looks great, but can we use it today?

If you are on the server (node),
the answer is *yes*, as long as you are on 0.11 or newer. Just start with
the `--harmony` flag to activate the ECMAScript 6 features.

Firefox and Chrome already support generators natively. To run them in all
browsers (and you probably want that), you can use a transpiler like
[Traceur](https://github.com/google/traceur-compiler) or
[regenerator](https://github.com/facebook/regenerator).

All examples shown here have been run with the newest version of node (0.11.14 as
of September 2014). The code can be found on
[GitHub](https://github.com/eiriklied/es6-generators).
