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

module.exports = globals
