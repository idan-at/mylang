const Symbols = require('./Symbols')
const {FunctionExpression} = require('../Parser/AST')
const {
  isNil,
  isTrue,
  isFalse,
  isString,
  isBoolean,
  isInt,
  isFloat
} = require('./type-checks')
const {INT, FLOAT, BOOLEAN} = require('./types')
const {TypeError, DivisionByZeroError} = require('../errors')

const globals = new Symbols()

function createGlobalFunction(name, args, fn) {
  globals.set(name, new FunctionExpression(symbols => {
    const fArgs = args.map(arg => symbols.get(arg))
    return fn(...fArgs)
  }, args))
}

function validateType(arg, validators) {
  const passed = validators.some(({fn}) => fn(arg.value))
  if (!passed) {
    const types = validators.map(v => v.typeName)
                            .map(typeName => `'${typeName}'`)
    throw new TypeError(`expected '${arg.name}' to be of one of the types [${types.join(' ')}]`)
  }
}

// Prints
createGlobalFunction('println', ['str'], str => console.log(str))

// Math
createGlobalFunction('+', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a + b
})

createGlobalFunction('-', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a - b
})

createGlobalFunction('*', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a * b
})

createGlobalFunction('/', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  if (b === 0) {
    throw new DivisionByZeroError('division by zero')
  }
  return a / b
})

createGlobalFunction('pow', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a ** b
})

createGlobalFunction('mod', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  if (b === 0) {
    throw new DivisionByZeroError('modolo by zero')
  }
  return a % b
})

// Bitwise
createGlobalFunction('|', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}])
  return a | b
})

createGlobalFunction('|', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}])
  return a & b
})

createGlobalFunction('~', ['a'], a => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}])
  return ~a
})

createGlobalFunction('xor', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}])
  return a ^ b
})

createGlobalFunction('<<', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}])
  return a << b
})

createGlobalFunction('>>', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}])
  return a >> b
})

createGlobalFunction('>>>', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}])
  return a >>> b
})

// Logic
createGlobalFunction('=', ['a', 'b'], (a, b) => {
  return a === b
})

createGlobalFunction('!=', ['a', 'b'], (a, b) => {
  return a !== b
})

createGlobalFunction('>', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a > b
})

createGlobalFunction('>=', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a >= b
})

createGlobalFunction('<', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a < b
})

createGlobalFunction('<=', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  validateType({value: b, name: 'b'}, [{fn: isInt, typeName: INT}, {fn: isFloat, typeName: FLOAT}])
  return a <= b
})

createGlobalFunction('and', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isBoolean, typeName: BOOLEAN}])
  validateType({value: b, name: 'b'}, [{fn: isBoolean, typeName: BOOLEAN}])
  return a && b
})

createGlobalFunction('or', ['a', 'b'], (a, b) => {
  validateType({value: a, name: 'a'}, [{fn: isBoolean, typeName: BOOLEAN}])
  validateType({value: b, name: 'b'}, [{fn: isBoolean, typeName: BOOLEAN}])
  return a || b
})

createGlobalFunction('not', ['a'], a => {
  validateType({value: a, name: 'a'}, [{fn: isBoolean, typeName: BOOLEAN}])
  return !a
})

// Type checks
createGlobalFunction('nil?', ['a'], a => isNil(a))
createGlobalFunction('int?', ['a'], a => isInt(a))
createGlobalFunction('float?', ['a'], a => isFloat(a))
createGlobalFunction('true?', ['a'], a => isTrue(a))
createGlobalFunction('false?', ['a'], a => isFalse(a))
createGlobalFunction('string?', ['a'], a => isString(a))

module.exports = globals
