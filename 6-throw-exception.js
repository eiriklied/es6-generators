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
