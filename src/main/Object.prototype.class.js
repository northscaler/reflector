/* eslint-disable */
'use strict'

const Reflector = require('./Reflector')

const defaultDescriptor = {
  configurable: false,
  enumerable: false,
  get: function () {
    return Reflector.getClassOf(this)
  },
  set: function (clazz) {
    Reflect.setPrototypeOf(this, clazz.prototype)
  }
}

/**
 * Defines a `class` property on `Object.prototype` that returns the result of `Reflector.getClassOf(this)`, which is effectively `this`'s class object, AKA constructor function.
 * This property is not enumerable or configurable.
 * Setting this property is equivalent to calling `Reflect.setPrototypeOf(this, clazz.prototype)`.
 *
 * @param {object} [arg0] The argument to be deconstructed.
 * @param {string} [arg0.name='class'] The name of the class property.
 * @param {boolean} [arg0.enumerable=false] Whether the property should be enumerable.
 * @param {boolean} [arg0.configurable=false] Whether the property should be configurable.
 */
module.exports = function ({
  name,
  enumerable,
  configurable
} = {}) {
  name = name || 'class'
  if (typeof name !== 'string') throw new Error('name must be a string')

  const has = Object.prototype.hasOwnProperty(name)

  if (has) return

  Object.defineProperty(Object.prototype, name, Object.assign({}, defaultDescriptor, {
    enumerable,
    configurable
  }))
}
