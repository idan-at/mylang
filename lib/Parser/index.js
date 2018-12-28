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
  RETURN,
  VARARGS,
  IF,
  ELSIF,
  ELSE
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
  IdentifierExpression,
  VarArgsExpression,
  IfStatement,
  ElsifStatement,
  ElseStatement
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
        case IF:
          body.push(this._ifStatement())
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

  _ifStatement() {
    this._pop()

    const condition = this._expression()
    const then = this._multiLineFunction()
    const ifStatement = new IfStatement(condition, then)

    let curr = ifStatement
    while(this._peek().symbol === ELSIF) {
      this._pop()
      const condition = this._expression()
      const then = this._multiLineFunction()
      const elsifStatement = new ElsifStatement(condition, then)
      curr.otherwise = elsifStatement
      curr = elsifStatement
    }

    if (this._peek().symbol === ELSE) {
      this._pop()
      const then = this._multiLineFunction()
      const elseStatement = new ElseStatement(then)
      curr.otherwise = elseStatement
    }

    return ifStatement
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
      case VARARGS:
        return new VarArgsExpression(next.text.substr(1))
      default:
        throw new SyntaxError(`invalid syntax '${next.text}'`)
    }
  }

  _function(name = 'anonymous') {
    const {args, varargs} = this._functionArgs()

    const next = this._peek()
    switch (next.symbol) {
      case LSCOPE:
        return new FunctionExpression(name, this._multiLineFunction(), args, varargs)
      default:
        return new FunctionExpression(name, [new ReturnStatement(this._expression())], args, varargs)
    }
  }

  _functionArgs() {
    let varargs = false
    const args = []
    const noMoreArgs = () => this._peek().symbol === RBRACKET

    while (!noMoreArgs()) {
      const arg = this._pop()
      switch (arg.symbol) {
        case IDENTIFIER:
          if (args.includes(arg.text)) {
            throw new ParserError(`double argument error ${arg.pos.join(':')}`)
          }
          args.push(arg.text)
          break
        case VARARGS:
          if (!noMoreArgs()) {
            throw new Parser(`${arg.text} must be used as the last argument`)
          }
          varargs = true
          args.push(arg.text)
          break
        default:
          throw new ParserError(`Expected identifier / @rest but got '${arg.text}' (${arg.pos.join(':')})`)
      }
    }

    const rbracket = this._pop()
    if (rbracket.symbol !== RBRACKET) {
      throw new ParserError(`Expected ']' but got '${rbracket.text}' (${rbracket.pos.join(':')})`)
    }

    return {args, varargs}
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
        case IF:
          body.push(this._ifStatement())
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
