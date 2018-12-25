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
  FunctionCall,
  IdentifierExpression
} = require('../Parser/AST')
const ReturnValue = require('./ReturnValue')
const globals = require('./globals')

class VM {
  constructor() {
    this._globals = globals
  }

  eval(ast) {
    this._eval(ast._body, this._globals)
  }

  main() {
    return this._eval(this._globals.get('main')._body, this._globals) 
  }

  _eval(body, symbols) {
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
        if (symbols.getOrUndefined(statement._identifier) !== undefined) {
          throw new Error(`Identifier '${statement._identifier}' already exists`)
        }
        return symbols.set(statement._identifier, this._evalExp(statement._expression, symbols))
      case ReturnStatement:
        return new ReturnValue(this._evalExp(statement._expression, symbols))
      case FunctionCall:
        return this._call(statement, symbols)
      default:
        throw new Error(`Invalid statement ${statement.constructor.name}`)
    }
  }

  _evalExp(expression, symbols) {
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
      case IdentifierExpression:
        return symbols.get(expression._name)
      default:
        throw new Error('Could not evaluate expression')
    }
  }

  _call(expression, symbols) {
    const f = symbols.get(expression._identifier)
    const args = expression._args

    const newSymbols = new Symbols(symbols)
    args.forEach((arg, idx) => newSymbols.set(f._args[idx], this._evalExp(arg, symbols)))

    if (typeof f._body === 'function') {
      return f._body(newSymbols)
    }

    return this._eval(f._body, newSymbols)
  }
}

module.exports = VM
