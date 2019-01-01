class Literal {
  constructor(value) {
    this._value = value
  }

  get value() {
    return this._value
  }

  get name() {
    return this.toString()
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

module.exports = {
  IntLiteral,
  FloatLiteral,
  StringLiteral,
  TrueLiteral,
  FalseLiteral,
  NilLiteral
}
