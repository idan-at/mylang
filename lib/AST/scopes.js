const Scope = require('./Scope')
const Symbols = require('../VM/Symbols')

class AST extends Scope {}
class FunctionExpression extends Scope {
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

    const body = this._toStringBody()
    return `${this.name} [${args}] { ${body} }`
  }

  _toStringArgs() {
    return this._args.join(' ')
  }

  _toStringBody() {
    if (typeof this._body === 'function') {
      return '[native]'
    }

    return `${this._body.map(line => `${line.toString()}`).join(', ')}`
  }
}

module.exports = {
  AST,
  FunctionExpression
}
