/* global describe, it, before */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const defineObjectPrototypeClassProperty = require('../../main/Object.prototype.class')

describe('unit tests of Object.prototype.class', function () {
  class Sup {sup () { return 'sup' + this.token }}

  class Sub extends Sup {sub () { return 'sub' + this.token }}

  before(defineObjectPrototypeClassProperty)

  it('should get the class of the instance', function () {
    const sub = new Sub()
    expect(sub.class).to.equal(Sub)
  })

  it('should set the class of the instance', function () {
    const token = 'token'
    const sub = { token }
    expect(sub.class).to.equal(Object)

    sub.class = Sub
    expect(sub.class).to.equal(Sub)
    expect(sub.sub()).to.equal('sub' + token)
    expect(sub.sup()).to.equal('sup' + token)
  })
})
