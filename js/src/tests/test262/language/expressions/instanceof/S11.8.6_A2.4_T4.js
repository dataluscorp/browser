// Copyright 2009 the Sputnik authors.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
info: First expression is evaluated first, and then second expression
es5id: 11.8.6_A2.4_T4
description: Checking with undeclarated variables
flags: [noStrict]
---*/

//CHECK#1
if ((OBJECT = Object, {}) instanceof OBJECT !== true) {
  throw new Test262Error('#1: (OBJECT = Object, {}) instanceof OBJECT !== true');
}

reportCompare(0, 0);
