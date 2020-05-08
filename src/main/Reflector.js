'use strict'

function assertFunction (it) {
  if (typeof it !== 'function') throw new TypeError('given value is not a function')
}

/**
 * @typedef MethodDescriptors
 * @property {string} name The name of the class whose methods are given in this object's `own` property.
 * @property {{string: PropertyDescriptor}} own An object whose keys are method names and whose values are `PropertyDescriptor`s.
 * @property {MethodDescriptors} [super] Recursive property that is as above except for the class's superclass.
 * Only present if the class has a superclass.
 */

/**
 * Convenient Reflector class.
 */
class Reflector {
  /**
   * Returns method descriptors for the given class, not ascending the prototype chain.
   *
   * @param {function} clazz The class constructor function.
   * @return {{string: PropertyDescriptor}}
   */
  static getOwnMethodDescriptors (clazz) {
    assertFunction(clazz)

    return Object.getOwnPropertyDescriptors(clazz.prototype)
  }

  /**
   * Returns method descriptors for the given class, including up the prototype chain.
   * The object returned has an `own` property containing the class's own methods, and, if the class has a superclass, a `super` property containing the same structure, recursively up the prototype chain.
   *
   * @param {function} clazz The class constructor function.
   * @return {MethodDescriptors}
   */
  static getAllMethodDescriptors (clazz) {
    assertFunction(clazz)

    const methods = { name: clazz.name, own: Reflector.getOwnMethodDescriptors(clazz) }

    const superclass = Reflector.getSuperclassOf(clazz)
    if (superclass) methods.super = Reflector.getAllMethodDescriptors(superclass)

    return methods
  }

  /**
   * Returns an object with references to each method defined on the given class, without ascending the prototype chain.
   *
   * @param {function} clazz The class constructor function.
   * @param {object} [thiz] A `this` reference that, if given, the returned functions are `bind`ed to, else the functions are not bound.
   * @return {{string: function}}
   */
  static getOwnMethods (clazz, thiz) {
    assertFunction(clazz)

    const descriptors = Reflector.getOwnMethodDescriptors(clazz)

    return Object.keys(descriptors)
      .reduce((accum, next) => {
        const method = descriptors[next].value
        if (!method) return accum

        accum[next] = thiz ? method.bind(thiz) : method

        return accum
      }, {})
  }

  /**
   * Returns an object with references to each method defined on the given class and all those up the prototype chain.
   * If a subclass overrides a method in the chain, only the overridden method is included in the results.
   *
   * @param {function} clazz The class constructor function.
   * @param {object} [thiz] A `this` reference that, if given, the returned functions are `bind`ed to, else the functions are not bound.
   * @return {{string: function}}
   */
  static getVirtualMethods (clazz, thiz) {
    function addVirtualMethods (methods, clazz, thiz) {
      if (!clazz) return methods

      const additionals = Reflector.getOwnMethods(clazz, thiz)
      Object.assign(additionals, methods)

      const superclass = Reflector.getSuperclassOf(clazz)
      if (!superclass) return additionals
      else return addVirtualMethods(additionals, superclass, thiz)
    }

    return addVirtualMethods(Reflector.getOwnMethods(clazz, thiz), Reflector.getSuperclassOf(clazz), thiz)
  }

  /**
   * Gets the superclass of the given class.
   *
   * @param {function} clazz The class constructor function.
   * @return {function}
   */
  static getSuperclassOf (clazz) {
    assertFunction(clazz)

    return clazz === Object ? null : Reflector.getPrototypeOf(clazz.prototype).constructor
  }

  /**
   * Get the class function of the given object.
   *
   * @param {object} object The instance whose class is being returned.
   * @return {function}
   */
  static getClassOf (object) {
    return Reflector.getPrototypeOf(object).constructor
  }
}

// add all properties from Reflect for convenience

Object.getOwnPropertyNames(Reflect).forEach(it => {
  if (it === 'apply') return

  if (Reflector[it]) throw new Error(`collision: class Reflector already has property ${it}`)

  Reflector[it] = Reflect[it]
})

module.exports = Reflector
