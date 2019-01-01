class Expression {
  constructor(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  toString() {
    return this.name
  }
}

class FunctionCall extends Expression {
  constructor(fn, args = []) {
    super('anonymous')
    this._fn = fn
    this._args = args
  }

  get fn() {
    return this._fn
  }

  get args() {
    return this._args
  }

  toString() {
    return `(${this.fn.name}${this.toStringArgs()})`
  }

  toStringArgs() {
    if (this.args.length > 0) {
      return ` ${this.args.join(' ')}`
    }

    return ''
  }
}

class IdentifierExpression extends Expression {}
class VarArgsExpression extends Expression {}

module.exports = {
  FunctionCall,
  IdentifierExpression,
  VarArgsExpression
}
