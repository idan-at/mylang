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
    this._eval(ast.iter, this._globals)
  }

  main() {
    const main = this._globals.get('main')
    return this._eval(main.iter, this._globals) 
  }

  runLine(statement, symbols = this._globals) {
    switch (statement.constructor) {
      case LetStatement:
        const name = statement.name
        if (symbols.getOrUndefined(name) !== undefined) {
          throw new Error(`Identifier '${name}' already exists`)
        }
        return symbols.set(name, this._evalExp(statement.expression, symbols))
      case ReturnStatement:
        return new ReturnValue(this._evalExp(statement.expression, symbols))
      default:
        return this._evalExp(statement, symbols)
    }
  }

  _eval(statements, symbols) {
    for (const statement of statements) {
      const result = this.runLine(statement, symbols)
      if (result instanceof ReturnValue) {
        return result.retVal
      }
    }

    return null
  }

  _evalExp(expression, symbols) {
    switch (expression.constructor) {
      case IntLiteral:
      case FloatLiteral:
      case StringLiteral:
      case NilLiteral:
      case TrueLiteral:
      case FalseLiteral:
        return expression.value
      case FunctionExpression:
        expression.closure = symbols
        return expression
      case FunctionCall:
        return this._call(this._evalExp(expression.fn, symbols), expression.args, symbols)
      case IdentifierExpression:
        return symbols.get(expression.name)
      default:
        throw new Error('Could not evaluate expression')
    }
  }

  _call(f, args, symbols) {
    if (!this._validFunctionCall(f, args)) {
      throw new Error(`${args.length} arguments passed to '${f.name}' (expected ${f.args.length})`)
    }

    const newSymbols = this._functionContext(f, args, symbols)

    if (typeof f.iter === 'function') {
      return f.iter(newSymbols)
    }

    return this._eval(f.iter, newSymbols)
  }

  _functionContext(f, args, symbols) {
    const newSymbols = new Symbols(f.closure)
    
    if (f.varargs) {
      const rest = []
      const restArgIndex = f.args.length - 1
      newSymbols.set(f.argAt(restArgIndex), rest)
      args.forEach((arg, idx) => {
        const evaluatedArg = this._evalExp(arg, symbols)
        if (idx < restArgIndex) {
          newSymbols.set(f.argAt(idx), evaluatedArg)
        } else {
          rest.push(evaluatedArg)
        }
      })
    } else {
      args.forEach((arg, idx) => newSymbols.set(f.argAt(idx), this._evalExp(arg, symbols)))
    }

    return newSymbols
  }

  _validFunctionCall(f, args) {
    if (f.varargs) {
      return args.length >= f.args.length - 1
    }

    return args.length === f.args.length
  }
}

module.exports = VM
