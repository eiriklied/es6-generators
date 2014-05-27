function *generator() {
  yield 2;
  yield 3;
  return 4;
}

var generatorObject = generator();
console.log(generatorObject.next());
console.log(generatorObject.next());
console.log(generatorObject.next());

// { value: 2, done: false }
// { value: 3, done: false }
// { value: 4, done: true }
