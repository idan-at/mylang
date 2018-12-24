const {
  LET,
  IDENTIFIER,
  LPAREN,
  RPAREN,
  INT,
  FLOAT,
  TRUE,
  FALSE,
  NIL,
  STRING,
  LBRACKET,
  RBRACKET,
  LSCOPE,
  RSCOPE,
  RETURN
} = require('../Lexer/symbols')
const {
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
  FunctionExpression
} = require('./AST')

class Parser {
  constructor() {
    this._tokens = null
    this._pos = 0
  }

  parse(tokens) {
    this._tokens = tokens
    const body = []

    while(!this._done()) {
      const next = this._peek()
      switch (next.symbol) {
        case LET:
          body.push(this._letStatement())
          break
        default:
          throw new Error(`Invlaid statement ${next.text}`)
      }
    }

    return new AST(body)
  }

  _letStatement() {
    this._pop()

    const identifier = this._pop()
    if (identifier.symbol !== IDENTIFIER) {
      throw new Error('Expected identifier')
    }

    const exp = this._expression()
    return new LetStatement(identifier.text, exp)
  }

  _expression() {
    if (this._peek().symbol === LPAREN) {
      return this._functionCall()
    }

    return this._literal()
  }

  _functionCall() {
    this._pop()

    const identifier = this._pop()
    if (identifier.symbol !== IDENTIFIER) {
      throw new Error('Expected identifier')
    }

    const args = []
    while (this._peek().symbol !== RPAREN) {
      args.push(this._expression())
    }

    const rparen = this._pop()
    if (rparen.symbol !== RPAREN) {
      throw new Error('Expected )')
    }

    return new FunctionCall(identifier.text, args)
  }

  _literal() {
    const next = this._pop()

    switch (next.symbol) {
      case INT:
        return new IntLiteral(next.text)
      case FLOAT:
        return new FloatLiteral(next.text)
      case STRING:
        return new StringLiteral(next.text)
      case TRUE:
        return new TrueLiteral()
      case FALSE:
        return new FalseLiteral()
      case NIL:
        return new NilLiteral()
      case LBRACKET:
        return this._function()
      default:
        throw new Error(`Invalid literal ${next.text}`)
    }
  }

  _function() {
    const args = []
    while (this._peek().symbol !== RBRACKET) {
      const arg = this._pop()
      if (arg.symbol !== IDENTIFIER) {
        throw new Error('Expected identifier')
      }

      args.push(arg)
    }

    const rbracket = this._pop()
    if (rbracket.symbol !== RBRACKET) {
      throw new Error('Expected ]')
    }

    const lscope = this._pop()
    if (lscope.symbol !== LSCOPE) {
      throw new Error('Expected {')
    }

    const body = this._functionBody()

    const rscope = this._pop()
    if (rscope.symbol !== RSCOPE) {
      throw new Error('Expected }')
    }

    return new FunctionExpression(args, body)
  }

  _functionBody() {
    const body = []

    while (this._peek().symbol !== RSCOPE) {
      const next = this._peek()
      switch(next.symbol) {
        case LET:
          body.push(this._letStatement())
          break
        case RETURN:
          body.push(this._returnStatement())
          break
        case LPAREN:
          body.push(this._functionCall())
          break
        default:
          throw new Error(`Invlaid statement ${next.text}`)
      }
    }

    return body
  }

  _returnStatement() {
    this._pop()

    return new ReturnStatement(this._expression())
  }

  _done() {
    return this._tokens.length <= this._pos
  }

  _peek() {
    if (this._done()) {
      throw new Error('Reached EOF')
    }

    return this._tokens[this._pos]
  }

  _pop() {
    if (this._done()) {
      throw new Error('Reached EOF')
    }
    
    return this._tokens[this._pos++]
  }
}

module.exports = Parser
