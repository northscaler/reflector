# `@northscaler/reflector`
JavaScript's reflection for mere mortals.

## Overview
This module leverages the fact that in the post-ES6 world, people use the `class` keyword.
The primary export of this module is a class called `Reflector`, that essentially extends JavaScript's native `Reflect` class, to make getting information about classes from a class-based frame of mind a little bit more intuitive.

## TL;DR
```javascript
'use strict'

const Reflector = require('@northscaler/reflector')

class Sup {
  go () { return 'sup gone' }
}

class Sub extends Sup {
  go () { return 'sub gone'}

  stop () { return 'stop' }
}

const sup = new Sup()
const sub = new Sub()

const SupClass = Reflector.getClassOf(sup)
console.log(SupClass.name) // logs Sup

const SubClass = Reflector.getClassOf(sub)
console.log(SubClass.name) // logs Sub

console.log(Reflector.getClassOf(sub) === Sub) // logs true 

console.log(Reflector.getSuperclassOf(Sub) === Sup) // logs true 

console.log(Reflector.getAllMethodDescriptors(Sub))
// logs { own: <Sub methods>, super: { own: <Sup methods>, super: { own: <Object methods> } } }

// ...and lots more, including all Reflect methods
```

## More information

TODO

See the docs unit tests for more information
