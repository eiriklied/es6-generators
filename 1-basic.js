function *myRandomNumbers() {
  console.log("myRandomNumbers starting!");
  yield 2;
  yield 3;
  return 4;
}

var generatorObj = myRandomNumbers();   // returning: [object Generator]
var returned = generatorObj.next();     // printing:  'myRandomNumbers starting!'
                                        // returning: { value: 2, done: false }
returned = generatorObj.next();         // returning: { value: 3, done: false }
returned = generatorObj.next();         // returning: { value: 4, done: true }
