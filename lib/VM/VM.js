const Symbols = require('./Symbols')
const {
  LetStatement,
  ReturnStatement,
  IntLiteral,
  FloatLiteral,
  StringLiteral,
  NilLiteral,
  TrueLiteral,
  FalseLiteral,
  FunctionExpression,
  FunctionCall
} = require('../Parser/AST')
const ReturnValue = require('./ReturnValue')
const globals = require('./globals')

class VM {
  constructor() {
    this._globals = globals // TODO: do not allow overriding globals (or maybe do??)
  }

  run(ast) {
    this._run(ast._body, this._globals)
    return this._run(this._globals.get('main')._body, this._globals)
  }

  _run(body, symbols) {
    for (const statement of body) {
      const result = this._runStatement(statement, symbols)
      if (result instanceof ReturnValue) {
        return result.retVal
      }
    }
  }

  _runStatement(statement, symbols) {
    switch (statement.constructor) {
      case LetStatement:
        return symbols.set(statement._identifier, this._eval(statement._expression))
      case ReturnStatement:
        return new ReturnValue(this._eval(statement._expression, symbols))
      case FunctionCall:
        return this._call(statement, symbols)
      default:
        throw new Error(`Invalid statement ${statement.constructor.name}`)
    }
  }

  _eval(expression, symbols) {
    switch (expression.constructor) {
      case IntLiteral:
      case FloatLiteral:
      case StringLiteral:
      case NilLiteral:
      case TrueLiteral:
      case FalseLiteral:
        return expression._value
      case FunctionExpression:
        return expression
      case FunctionCall:
        return this._call(expression, symbols)
    }
  }

  _call(expression, symbols) {
    const f = symbols.get(expression._identifier)
    const args = expression._args
    const newSymbols = new Symbols(symbols)
    args.forEach((arg, idx) => newSymbols.set(f._args[idx], this._eval(arg, symbols)))

    if (typeof f._body === 'function') {
      return f._body(newSymbols)
    }

    return this._run(f._body, newSymbols)
  }
}

module.exports = VM
