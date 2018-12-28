const Symbols = require('./Symbols')
const { FunctionExpression } = require('../Parser/AST')
const {
  isNil,
  isTrue,
  isFalse,
  isString,
  isBoolean,
  isInt,
  isFloat,
  isFunction
} = require('./type-checks')
const { INT, FLOAT, BOOLEAN } = require('./types')
const { TypeError, DivisionByZeroError } = require('../errors')

const globals = new Symbols()

function createGlobalFunction(name, args, fn, varargs = false) {
  globals.set(name, new FunctionExpression(symbols => {
    const fArgs = args.map(arg => symbols.get(arg))
    return fn(...fArgs)
  }, args, varargs))
}

function validateType(arg, validators) {
  const passed = validators.some(({ fn }) => fn(arg.value))
  if (!passed) {
    const types = validators.map(v => v.typeName)
      .map(typeName => `'${typeName}'`)
    throw new TypeError(`expected '${arg.name}' to be of one of the types [${types.join(' ')}]`)
  }
}

// Prints
createGlobalFunction('println', ['str'], str => console.log(str === null ? 'nil' : str.toString()))

// Math
createGlobalFunction('+', ['a', 'b', 'rest'], (a, b, rest) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  rest.forEach((arg, idx) => {
    validateType({ value: arg, name: `rest[${idx}]` }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  })
  return [a, b, ...rest].reduce((acc, x) => acc + x, 0)
}, true)

createGlobalFunction('-', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  return a - b
})

createGlobalFunction('*', ['a', 'b', 'rest'], (a, b, rest) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  rest.forEach((arg, idx) => {
    validateType({ value: arg, name: `rest[${idx}]` }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  })
  return [a, b, ...rest].reduce((acc, x) => acc * x, 1)
}, true)

createGlobalFunction('/', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  if (b === 0) {
    throw new DivisionByZeroError('division by zero')
  }
  return a / b
})

createGlobalFunction('pow', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  return a ** b
})

createGlobalFunction('mod', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  if (b === 0) {
    throw new DivisionByZeroError('modolo by zero')
  }
  return a % b
})

// Bitwise
createGlobalFunction('|', ['a', 'b', 'rest'], (a, b, rest) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }])
  rest.forEach((arg, idx) => {
    validateType({ value: arg, name: `rest[${idx}]` }, [{ fn: isInt, typeName: INT }])
  })

  return [a, b, ...rest].reduce((acc, x) => acc | x, 0)
}, true)

createGlobalFunction('&', ['a', 'b', 'rest'], (a, b, rest) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }])
  rest.forEach((arg, idx) => {
    validateType({ value: arg, name: `rest[${idx}]` }, [{ fn: isInt, typeName: INT }])
  })

  return [a, b, ...rest].reduce((acc, x) => acc & x, 1)
}, true)

createGlobalFunction('~', ['a'], a => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }])
  return ~a
})

createGlobalFunction('xor', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }])
  return a ^ b
})

createGlobalFunction('<<', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }])
  return a << b
})

createGlobalFunction('>>', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }])
  return a >> b
})

createGlobalFunction('>>>', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }])
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
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  return a > b
})

createGlobalFunction('>=', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  return a >= b
})

createGlobalFunction('<', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  return a < b
})

createGlobalFunction('<=', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  validateType({ value: b, name: 'b' }, [{ fn: isInt, typeName: INT }, { fn: isFloat, typeName: FLOAT }])
  return a <= b
})

createGlobalFunction('and', ['a', 'b', 'rest'], (a, b, rest) => {
  validateType({ value: a, name: 'a' }, [{ fn: isBoolean, typeName: BOOLEAN }])
  validateType({ value: b, name: 'b' }, [{ fn: isBoolean, typeName: BOOLEAN }])

  rest.forEach((arg, idx) => {
    validateType({ value: arg, name: `rest[${idx}]` }, [{ fn: isBoolean, typeName: BOOL }])
  })

  return [a, b, ...rest].reduce((acc, x) => acc && x, true)
}, true)

createGlobalFunction('or', ['a', 'b'], (a, b) => {
  validateType({ value: a, name: 'a' }, [{ fn: isBoolean, typeName: BOOLEAN }])
  validateType({ value: b, name: 'b' }, [{ fn: isBoolean, typeName: BOOLEAN }])

  rest.forEach((arg, idx) => {
    validateType({ value: arg, name: `rest[${idx}]` }, [{ fn: isBoolean, typeName: BOOL }])
  })

  return [a, b, ...rest].reduce((acc, x) => acc || x, false)
}, true)

createGlobalFunction('not', ['a'], a => {
  validateType({ value: a, name: 'a' }, [{ fn: isBoolean, typeName: BOOLEAN }])
  return !a
})

createGlobalFunction('if', ['condition', 'then', 'else'], (condition, then, else_) => {
  validateType({ value: condition, name: 'condition' }, [{ fn: isBoolean, typeName: BOOLEAN }])

  return condition ? then : else_
})

// Type checks
createGlobalFunction('nil?', ['a'], a => isNil(a))
createGlobalFunction('int?', ['a'], a => isInt(a))
createGlobalFunction('float?', ['a'], a => isFloat(a))
createGlobalFunction('true?', ['a'], a => isTrue(a))
createGlobalFunction('false?', ['a'], a => isFalse(a))
createGlobalFunction('string?', ['a'], a => isString(a))
createGlobalFunction('function?', ['a'], a => isFunction(a))

module.exports = globals
