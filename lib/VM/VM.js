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
  IdentifierExpression,
  VarArgsExpression,
  IfStatement
} = require('../Parser/AST')
const ReturnValue = require('./ReturnValue')
const globals = require('./globals')
const {TypeError} = require('../errors')
const format = require('./format')

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
      case IfStatement:
        return this._runIf(statement, symbols)
      case ReturnStatement:
        return new ReturnValue(this._evalExp(statement.expression, symbols))
      default:
        return this._evalExp(statement, symbols)
    }
  }

  _runIf(statement, symbols) {
    const cond = this._evalExp(statement.condition, symbols)
    if (cond !== true && cond !== false) {
      throw new TypeError(`expected if to be called with a boolean, but it was called with ${format(cond)}`)
    }

    if (cond) {
      return this._eval(statement.iter, symbols)
    } else if (statement.otherwise) {
      return this._runIf(statement.otherwise, symbols)
    }
  }

  _eval(statements, symbols) {
    for (const statement of statements) {
      const result = this.runLine(statement, symbols)
      if (result instanceof ReturnValue) {
        return result
      }
    }

    return new ReturnValue(null)
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
      newSymbols.set(f.argAt(restArgIndex).substr(1), rest)
      args.forEach((arg, idx) => {
        if (idx < restArgIndex) {
          newSymbols.set(f.argAt(idx), this._evalArg(arg, symbols))
        } else {
          try {
            rest.push(this._evalArg(arg, symbols))
          } catch(e) {
            if (arg instanceof VarArgsExpression) {
              rest.push(...symbols.get(arg.name))
            } else {
              throw e
            }
          }
        }
      })
    } else {
      args.forEach((arg, idx) => newSymbols.set(f.argAt(idx), this._evalArg(arg, symbols)))
    }

    return newSymbols
  }

  _evalArg(arg, symbols) {
    const result = this._evalExp(arg, symbols)
    return result instanceof ReturnValue ? result.retVal : result
  }

  _validFunctionCall(f, args) {
    if (f.varargs) {
      return args.length >= f.args.length - 1
    }

    return args.length === f.args.length
  }
}

module.exports = VM
