const Symbols = require('../VM/Symbols')

class AST {
  constructor(body) {
    this._body = body
  }

  first() {
    return this._body[0]
  }

  iter() {
    return this._body
  }
}

class FunctionExpression extends AST {
  constructor(body, args = []) {
    super(body)
    this._args = args
    this._symbols = new Symbols()
  }

  get closure() {
    return this._symbols
  }

  args() {
    return this._args
  }

  argAt(idx) {
    return this._args[idx]
  }

  setClosure(symbols) {
    this._symbols.setClosure(symbols)
  }

  toString() {
    const args = this._args.join(' ')
    const body = typeof this._body === 'function' ? '[native]' : this._body.map(line => line.toString())
    return `[${args}] { ${body} }`
  }
}

class Statement {
  constructor(expression) {
    this._expression = expression
  }

  expression() {
    return this._expression
  }
}

class LetStatement extends Statement {
  constructor(expression, identifier) {
    super(expression)
    this._identifier = identifier
  }

  name() {
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
  constructor(identifier, args = []) {
    this._identifier = identifier
    this._args = args
  }

  name() {
    return this._identifier.name()
  }

  args() {
    return this._args
  }

  toString() {
    const args = this._args.join(' ')
    return `(${this.name()} ${args})`
  }
}

class Literal {
  constructor(value) {
    this._value = value
  }

  value() {
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

  name() {
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
