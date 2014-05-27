# Generators

> a beginners guide

Note:  
All examples in this repo can be run with the newest version of node (0.11.12 as of May 2014).
To activate the ES6 (Harmony) features, start node with the `--harmony` flag
when running the examples.


## What are generators?

A generator looks very much like a function, but its annotated with an extra `*`.

The inside of the generator is just like regular JavaScript except for one thing.
You can use the keyword `yield` in front of any expression.

```javascript
function *myRandomNumbers() {
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
executing until it comes to its first `yield` expression. Here, `next()` will
return an object containg two things

- `value`: the value of the yielded expression
- `done`: a flag telling us wether the generator is done running;

If you call `next()` again, the generator will continue to execute from where
it stopped until it reaches a new `yield`, and `next()` will return with the
freshly yielded value again.

Lets run the `myRandomNumbers` generator from above and see what we get:

```javascript
var generatorObj = myRandomNumbers();   // [object Generator]
var returned = generatorObj.next(); // { value: 2, done: false }
returned = generatorObj.next();     // { value: 3, done: false }
returned = generatorObj.next();     // { value: 4, done: true }
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

var evenGenerator = even(2, 1000000);
evenGenerator.next(); // {value: 2, done: false}
evenGenerator.next(); // {value: 4, done: false}
evenGenerator.next(); // {value: 6, done: false}
```


## Control flow

Even though generators can be used to create advanced iterators, this is not
where they will make a big change. But a huge win of generators is how you can
control the flow of your application.

I had some problems grasping this at first,
but generators is actually a way of creating a function that can be suspended at
any given time (by calling `yield`), giving control to some other part of the
application. When your application is ready, it can start your function again
calling `next()` on your generator. Do you see where this is going?

We can now actually do some fancy async programming, but instead of using
callbacks, we can just pause a generator and start it up again when its time to
continue.

Lets look at an example. We are going to use a few libraries here but the concept
shouldn't be hard do grasp.

NOT DONE YET! gonna write some examples based on [example 3](3-get-sync.js) and [example 4](4-get-async.js) here.


## Found in..

As of May 2014, Chrome has experimental support for ES6 using the
[chrome://flags/#enable-javascript-harmony](chrome://flags/#enable-javascript-harmony)
flag.

Firefox has had support for generators for quite a while as far as I know.

Node supports ES6 as long as you're on 0.11.

Have a look at the really cool [Koa](http://koajs.com/) framework, made by the
people behind [Express](http://expressjs.com/). This framework uses generators
to control the flow of your application using middleware.
