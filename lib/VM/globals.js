const Symbols = require('./Symbols')
const {FunctionExpression} = require('../Parser/AST')

const globals = new Symbols()
globals.set('println', new FunctionExpression(symbols => {
  const str = symbols.get('str')
  return console.log(str)
}, ['str']))

module.exports = globals
