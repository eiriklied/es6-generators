function *even(min, max) {
  var current = min;
  while(current <= max) {
    yield current;
    current = current + 2;
  }
}

var sequence = even(2, 10);
console.log(sequence.next());
console.log(sequence.next());
console.log(sequence.next());
console.log(sequence.next());
console.log(sequence.next());
console.log(sequence.next());
// { value: 2, done: false }
// { value: 4, done: false }
// { value: 6, done: false }
// { value: 8, done: false }
// { value: 10, done: false }
// { value: undefined, done: true }
