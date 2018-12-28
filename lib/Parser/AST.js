const Symbols = require('../VM/Symbols')

class AST {
  constructor(body) {
    this._body = body
  }

  get iter() {
    return this._body
  }
}

class FunctionExpression extends AST {
  constructor(name, body, args, varargs) {
    super(body)
    this._name = name
    this._args = args
    this._symbols = new Symbols()
    this._varargs = varargs
  }

  get name() {
    return this._name
  }

  get closure() {
    return this._symbols
  }

  get varargs() {
    return this._varargs
  }

  get args() {
    return this._args
  }

  argAt(idx) {
    return this._args[idx]
  }

  set closure(symbols) {
    this._symbols.setClosure(symbols)
  }

  toString() {
    const args = this._toStringArgs()
    const body = typeof this._body === 'function' ? '[native]' : this._body.map(line => line.toString())
    return `${this.name} [${args}] { ${body} }`
  }

  _toStringArgs() {
    const args = this._args
    if (this.varargs) {
      this.args[this.args.length - 1] = `@${this.args[this.args.length - 1]}`
    }
    
    return args.join(' ')
  }
}

class Statement {
  constructor(expression) {
    this._expression = expression
  }

  get expression() {
    return this._expression
  }
}

class LetStatement extends Statement {
  constructor(expression, identifier) {
    super(expression)
    this._identifier = identifier
  }

  get name() {
    return this._identifier.text
  }

  toString() {
    return `let ${this.name()} ${this._expression.toString()}`
  }
}
class ReturnStatement extends Statement {
  toString() {
    return `return ${this._expression.toString()}`
  }
}

class FunctionCall {
  constructor(fn, args = []) {
    this._fn = fn
    this._args = args
  }

  get fn() {
    return this._fn
  }

  get args() {
    return this._args
  }
}

class Literal {
  constructor(value) {
    this._value = value
  }

  get value() {
    return this._value
  }

  toString() {
    return this._value.toString()
  }
}

class IntLiteral extends Literal {
  constructor(value) {
    super(parseInt(value))
  }
}
class FloatLiteral extends Literal {
  constructor(value) {
    super(parseFloat(value))
  }
}
class StringLiteral extends Literal {
  constructor(value) {
    super(value.substr(1, value.length - 2))
  }
}
class TrueLiteral extends Literal {
  constructor() {
    super(true)
  }
}
class FalseLiteral extends Literal {
  constructor() {
    super(false)
  }
}
class NilLiteral extends Literal {
  constructor() {
    super(null)
  }

  toString() {
    return 'nil'
  }
}

class IdentifierExpression {
  constructor(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  toString() {
    return this.name()
  }
}

module.exports = {
  AST,
  LetStatement,
  ReturnStatement,
  FunctionCall,
  IntLiteral,
  FloatLiteral,
  StringLiteral,
  TrueLiteral,
  FalseLiteral,
  NilLiteral,
  FunctionExpression,
  IdentifierExpression
}
