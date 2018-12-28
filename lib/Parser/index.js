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
  FunctionExpression,
  IdentifierExpression
} = require('./AST')
const {ParserError, SyntaxError} = require('../errors')

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
          body.push(this._expression())
          break
      }
    }

    return new AST(body)
  }

  _letStatement() {
    this._pop()

    const identifier = this._pop()
    if (identifier.symbol !== IDENTIFIER) {
      throw new ParserError(`Expected identifier but got '${identifier.text}' (${identifier.pos.join(':')})`)
    }

    const exp = this._expression(identifier.text)
    return new LetStatement(exp, identifier)
  }

  _expression(name) {
    if (this._peek().symbol === LPAREN) {
      return this._functionCall()
    }

    return this._literal(name)
  }

  _functionCall() {
    this._pop()

    const fn = this._expression()

    const args = []
    while (this._peek().symbol !== RPAREN) {
      args.push(this._expression())
    }

    const rparen = this._pop()
    if (rparen.symbol !== RPAREN) {
      throw new ParserError(`Expected ')' but got '${rparen.text}' (${rparen.pos.join(':')})`)
    }

    return new FunctionCall(fn, args)
  }

  _literal(name) {
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
        return this._function(name)
      case IDENTIFIER:
        return new IdentifierExpression(next.text)
      default:
        throw new SyntaxError(`invalid syntax '${next.text}'`)
    }
  }

  _function(name = 'anonymous') {
    const args = []
    while (this._peek().symbol !== RBRACKET) {
      const arg = this._pop()
      if (arg.symbol !== IDENTIFIER) {
        throw new ParserError(`Expected identifier but got '${arg.text}' (${arg.pos.join(':')})`)
      }

      if (args.includes(arg.text)) {
        throw new ParserError(`double argument error ${arg.pos.join(':')}`)
      }

      args.push(arg.text)
    }

    const rbracket = this._pop()
    if (rbracket.symbol !== RBRACKET) {
      throw new ParserError(`Expected ']' but got '${rbracket.text}' (${rbracket.pos.join(':')})`)
    }

    const next = this._peek()
    switch (next.symbol) {
      case LSCOPE:
        return new FunctionExpression(name, this._multiLineFunction(), args)
      default:
        return new FunctionExpression(name, [new ReturnStatement(this._expression())], args)
    }
  }

  _multiLineFunction() {
    const lscope = this._pop()
    if (lscope.symbol !== LSCOPE) {
      throw new ParserError(`Expected '{' but got '${lscope.text}' (${lscope.pos.join(':')})`)
    }

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
          body.push(this._expression())
      }
    }

    const rscope = this._pop()
    if (rscope.symbol !== RSCOPE) {
      throw new ParserError(`Expected '}' but got '${rscope.text}' (${rscope.pos.join(':')})`)
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
      throw new ParserError(`Unexpected EOF`)
    }

    return this._tokens[this._pos]
  }

  _pop() {
    if (this._done()) {
      throw new ParserError(`Unexpected EOF`)
    }
    
    return this._tokens[this._pos++]
  }
}

module.exports = Parser
