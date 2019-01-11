const Scope = require('./Scope')
const { TrueLiteral } = require('./literals')

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
    return this._identifier
  }

  toString() {
    return `let ${this.name} ${this._expression.toString()}`
  }
}

class ConditionalStatement extends Scope {
  constructor(condition, body, otherwise = null) {
    super(body)
    this._condition = condition
    this._otherwise = otherwise
  }

  get condition() {
    return this._condition
  }

  get otherwise() {
    return this._otherwise
  }

  set otherwise(newOtherwise) {
    this._otherwise = newOtherwise
  }
}

class IfStatement extends ConditionalStatement { }
class ElsifStatement extends ConditionalStatement { }
class ElseStatement extends ConditionalStatement {
  constructor(body) {
    super(new TrueLiteral(), body)
  }
}

module.exports = {
  LetStatement,
  IfStatement,
  ElsifStatement,
  ElseStatement
}
