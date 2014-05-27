function *even(min, max) {
  var current = min;
  while(current <= max) {
    yield current;
    current = current + 2;
  }
}

var sequence = even(2, 1000000);
for(number of sequence) {
  console.log(number)
}
