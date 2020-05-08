'use strict'

const Reflector = require('../../..')

class Sup {
  go () { return 'sup gone' }
}

class Sub extends Sup {
  go () { return 'sub gone' }

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

// ...and lots more.
