class AST {
  constructor(body) {
    this._body = body
  }
}

class LetStatement {
  constructor(identifier, expression) {
    this._identifier = identifier
    this._expression = expression
  }
}

class ReturnStatement {
  constructor(expression) {
    this._expression = expression
  }
}

class FunctionCall {
  constructor(identifier, args) {
    this._identifier = identifier
    this._args = args
  }
}

class Literal {
  constructor(value) {
    this._value = value
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
}

class FunctionExpression {
  constructor(args, body) {
    this._args = args
    this._body = body
  }
}

class IdentifierExpression {
  constructor(name) {
    this._name = name
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
