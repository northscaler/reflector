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

const defineObjectPrototypeClassProperty = require('../../main/Object.prototype.class')

defineObjectPrototypeClassProperty()

class It {hello () { return 'hello' }}

const it = new It()

console.log(it.class === It)

const plain = {}

plain.class = It

console.log(plain.hello())
