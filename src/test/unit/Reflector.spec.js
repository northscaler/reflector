/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const Reflector = require('../../..')

describe('unit tests of Reflector', function () {
  it('should get Object methods', function () {
    expect(Object.keys(Reflector.getOwnMethodDescriptors(Object)).includes('__defineGetter__'))
  })

  it('should include Object methods', function () {
    class It {}

    expect(Object.keys(Reflector.getOwnMethodDescriptors(It)).includes('__defineGetter__'))
  })

  it('should get class of object', function () {
    class It {}

    const it = new It()
    const clazz = Reflector.getClassOf(it)
    expect(clazz).to.equal(It)
    expect(clazz.name).to.equal('It')
  })

  it('should get own method descriptors', function () {
    class Sup {
      sup () {
        return 'sup'
      }
    }

    class Sub extends Sup {
      sub () {
        return 'sub'
      }
    }

    expect(Object.keys(Reflector.getOwnMethodDescriptors(Sub)).sort()).to.deep.equal(['sub', 'constructor'].sort())
  })

  it('should get own methods', function () {
    class Sup {
      sup () {
        return 'sup' + this.token
      }
    }

    class Sub extends Sup {
      sub () {
        return 'sub' + this.token
      }
    }

    const sub = new Sub()
    const token = sub.token = 'x'

    let methods = Reflector.getOwnMethods(Sub)
    expect(methods.sub()).to.equal('subundefined')
    expect(methods.sup).to.be.undefined()

    methods = Reflector.getOwnMethods(Sub, sub)
    expect(methods.sub()).to.equal('sub' + token)
    expect(methods.sup).to.be.undefined()
  })

  it('should get virtual methods', function () {
    class Sup {
      sup () {
        return 'sup' + this.token
      }
    }

    class Sub extends Sup {
      sup () {
        return this.token + 'sup'
      }

      sub () {
        return 'sub' + this.token
      }
    }

    const token = 'x'

    const sup = new Sup()
    sup.token = token

    const sub = new Sub()
    sub.token = token

    let methods

    methods = Reflector.getOwnMethods(Sup)
    expect(methods.sup()).to.equal('supundefined')

    methods = Reflector.getOwnMethods(Sup, sup)
    expect(methods.sup()).to.equal('sup' + token)

    methods = Reflector.getOwnMethods(Sub)
    expect(methods.sup()).to.equal('undefinedsup')
    expect(methods.sub()).to.equal('subundefined')

    methods = Reflector.getOwnMethods(Sub, sub)
    expect(methods.sup()).to.equal(token + 'sup')
    expect(methods.sub()).to.equal('sub' + token)

    methods = Reflector.getVirtualMethods(Sub)
    expect(methods.sup()).to.equal('undefinedsup')
    expect(methods.sub()).to.equal('subundefined')

    methods = Reflector.getVirtualMethods(Sub, sub)
    expect(methods.sup()).to.equal(token + 'sup')
    expect(methods.sub()).to.equal('sub' + token)
  })

  it('should get all methods with no method overriding', function () {
    class Sup {
      sup () {
        return 'sup'
      }
    }

    class Sub extends Sup {
      sub () {
        return 'sub'
      }
    }

    const methods = Reflector.getAllMethodDescriptors(Sub)
    expect(Object.keys(methods.own).sort()).to.deep.equal(['sub', 'constructor'].sort())
    expect(Object.keys(methods.super.own).sort()).to.deep.equal(['sup', 'constructor'].sort())
  })

  it('should get Object as class of literal object', function () {
    expect(Reflector.getClassOf({})).to.equal(Object)
  })

  it('should get Array as class of literal array', function () {
    const c = Reflector.getClassOf([])
    expect(c).to.equal(Array)
    expect(Reflector.getSuperclassOf(c)).to.equal(Object)
  })

  it('should get Array as class of Array object', function () {
    // eslint-disable-next-line no-array-constructor
    const c = Reflector.getClassOf(new Array())
    expect(c).to.equal(Array)
    expect(Reflector.getSuperclassOf(c)).to.equal(Object)
  })

  it('should get Set as class of Set object', function () {
    const c = Reflector.getClassOf(new Set())
    expect(c).to.equal(Set)
    expect(Reflector.getSuperclassOf(c)).to.equal(Object)
  })

  it('should get Map as class of Map object', function () {
    const c = Reflector.getClassOf(new Map())
    expect(c).to.equal(Map)
    expect(Reflector.getSuperclassOf(c)).to.equal(Object)
  })

  it('should get Date as class of date', function () {
    const c = Reflector.getClassOf(new Date())
    expect(c).to.equal(Date)
    expect(Reflector.getSuperclassOf(c)).to.equal(Object)
  })

  it('should get Number as class of number instance', function () {
    // eslint-disable-next-line no-new-wrappers
    expect(Reflector.getClassOf(new Number(42))).to.equal(Number)
    // eslint-disable-next-line no-new-wrappers
    expect(Reflector.getClassOf(new Number(NaN))).to.equal(Number)
  })

  it('should get null superclass of Object', function () {
    expect(Reflector.getSuperclassOf(Object)).to.be.null()
  })

  it('should throw getting superclass of non-function', function () {
    expect(() => Reflector.getSuperclassOf({})).to.throw(TypeError)
  })

  it('should get superclass', function () {
    class Sup {
    }

    class Sub extends Sup {
    }

    expect(Reflector.getSuperclassOf(Sub)).to.equal(Sup)
    expect(Reflector.getSuperclassOf(Sup)).to.equal(Object)
  })

  it('should support Reflect methods', function () {
    class It {
      constructor (it) {
        this.it = it
      }

      go () { return 'go' }
    }

    const value = 'value'
    const it = new It(value)

    expect(Reflector.get(it, 'it')).to.equal(value)
  })
})
