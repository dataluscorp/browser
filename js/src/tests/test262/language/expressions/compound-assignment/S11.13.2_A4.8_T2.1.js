// Copyright 2009 the Sputnik authors.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
info: The production x >>>= y is the same as x = x >>> y
es5id: 11.13.2_A4.8_T2.1
description: >
    Type(x) is different from Type(y) and both types vary between
    Number (primitive or object) and Boolean (primitive and object)
---*/

var x;

//CHECK#1
x = true;
x >>>= 1;
if (x !== 0) {
  throw new Test262Error('#1: x = true; x >>>= 1; x === 0. Actual: ' + (x));
}

//CHECK#2
x = 1;
x >>>= true;
if (x !== 0) {
  throw new Test262Error('#2: x = 1; x >>>= true; x === 0. Actual: ' + (x));
}

//CHECK#3
x = new Boolean(true);
x >>>= 1;
if (x !== 0) {
  throw new Test262Error('#3: x = new Boolean(true); x >>>= 1; x === 0. Actual: ' + (x));
}

//CHECK#4
x = 1;
x >>>= new Boolean(true);
if (x !== 0) {
  throw new Test262Error('#4: x = 1; x >>>= new Boolean(true); x === 0. Actual: ' + (x));
}

//CHECK#5
x = true;
x >>>= new Number(1);
if (x !== 0) {
  throw new Test262Error('#5: x = true; x >>>= new Number(1); x === 0. Actual: ' + (x));
}

//CHECK#6
x = new Number(1);
x >>>= true;
if (x !== 0) {
  throw new Test262Error('#6: x = new Number(1); x >>>= true; x === 0. Actual: ' + (x));
}

//CHECK#7
x = new Boolean(true);
x >>>= new Number(1);
if (x !== 0) {
  throw new Test262Error('#7: x = new Boolean(true); x >>>= new Number(1); x === 0. Actual: ' + (x));
}

//CHECK#8
x = new Number(1);
x >>>= new Boolean(true);
if (x !== 0) {
  throw new Test262Error('#8: x = new Number(1); x >>>= new Boolean(true); x === 0. Actual: ' + (x));
}

reportCompare(0, 0);
