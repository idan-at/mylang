const Symbols = require('./Symbols')
const {FunctionExpression} = require('../Parser/AST')

const globals = new Symbols()

// Prints
globals.set('println', new FunctionExpression(symbols => {
  const str = symbols.get('str')
  return console.log(str)
}, ['str']))

// Math
globals.set('+', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a + b
}, ['a', 'b']))

globals.set('-', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a - b
}, ['a', 'b']))

globals.set('*', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a * b
}, ['a', 'b']))

globals.set('/', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a / b
}, ['a', 'b']))

globals.set('pow', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a ** b
}, ['a', 'b']))

// Bitwise
globals.set('|', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a | b
}, ['a', 'b']))

globals.set('&', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a & b
}, ['a', 'b']))

globals.set('~', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return ~a
}, ['a']))

globals.set('xor', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a ^ b
}, ['a', 'b']))

globals.set('<<', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a << b
}, ['a', 'b']))

globals.set('>>', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a >> b
}, ['a', 'b']))

globals.set('>>>', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a >>> b
}, ['a', 'b']))

// Logic
globals.set('=', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a === b
}, ['a', 'b']))

globals.set('!=', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a !== b
}, ['a', 'b']))

globals.set('>', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a > b
}, ['a', 'b']))

globals.set('>=', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a >= b
}, ['a', 'b']))

globals.set('<', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a < b
}, ['a', 'b']))

globals.set('<=', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a <= b
}, ['a', 'b']))

globals.set('and', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a && b
}, ['a', 'b']))

globals.set('or', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  const b = symbols.get('b')
  return a || b
}, ['a', 'b']))

globals.set('not', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return !a
}, ['a']))

// Type checks
globals.set('nil?', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return a === null
}, ['a']))

globals.set('int?', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return Number.isInteger(a)
}, ['a']))

globals.set('float?', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return typeof a === 'number' && !Number.isInteger(a)
}, ['a']))

globals.set('true?', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return a === true
}, ['a']))

globals.set('false?', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return a === false
}, ['a']))

globals.set('string?', new FunctionExpression(symbols => {
  const a = symbols.get('a')
  return typeof a === 'string'
}, ['a']))


module.exports = globals
