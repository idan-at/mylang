const Symbols = require('./Symbols')
const {FunctionExpression} = require('../Parser/AST')

const globals = new Symbols()
globals.set('println', new FunctionExpression(['str'], symbols => {
  const str = symbols.get('str')
  return console.log(str)
}))

module.exports = globals
