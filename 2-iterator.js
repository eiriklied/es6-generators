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
