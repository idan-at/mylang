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
    this._eval(ast.iter(), this._globals)
  }

  main() {
    const main = this._globals.get('main')
    return this._eval(main.iter(), this._globals) 
  }

  _eval(statements, symbols) {
    for (const statement of statements) {
      const result = this.runLine(statement, symbols)
      if (result instanceof ReturnValue) {
        return result.retVal
      }
    }
  }

  runLine(statement, symbols = this._globals) {
    switch (statement.constructor) {
      case LetStatement:
        const name = statement.name()
        if (symbols.getOrUndefined(name) !== undefined) {
          throw new Error(`Identifier '${name}' already exists`)
        }
        return symbols.set(name, this._evalExp(statement.expression(), symbols))
      case ReturnStatement:
        return new ReturnValue(this._evalExp(statement.expression(), symbols))
      default:
        return this._evalExp(statement, symbols)
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
        return expression.value()
      case FunctionExpression:
        return expression
      case FunctionCall:
        return this._call(expression, symbols)
      case IdentifierExpression:
        return symbols.get(expression.name())
      default:
        throw new Error('Could not evaluate expression')
    }
  }

  _call(expression, symbols) {
    const f = symbols.get(expression.name())
    const args = expression.args()

    const newSymbols = new Symbols(symbols)
    args.forEach((arg, idx) => newSymbols.set(f.argAt(idx), this._evalExp(arg, symbols)))

    if (typeof f.iter() === 'function') {
      return f.iter()(newSymbols)
    }

    return this._eval(f.iter(), newSymbols)
  }
}

module.exports = VM
