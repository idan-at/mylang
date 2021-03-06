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
  VARARGS,
  IF,
  ELSIF,
  ELSE,
  ASSIGN,
  EOF
} = require("../Lexer/symbols");
const {
  AST,
  LetStatement,
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
  IfExpression,
  ElsifExpression,
  ElseExpression,
  FunctionArgumentExpression
} = require("../AST");
const { ParserError, SyntaxError } = require("../errors");

class Parser {
  constructor(tokens) {
    this._tokens = tokens;
    this._pos = 0;
  }

  parse() {
    const body = [];

    while (!this._done()) {
      body.push(this._line());
    }

    return new AST(body);
  }

  _line() {
    switch (this._peek().symbol) {
      case LET:
        return this._letStatement();
      default:
        return this._expression();
    }
  }

  _scope() {
    if (this._peek().symbol !== LSCOPE) {
      return [this._expression()];
    }

    this._pop();

    const body = [];
    while (this._peek().symbol !== RSCOPE) {
      body.push(this._line());
    }

    this._popBySymbolOrThrow(
      RSCOPE,
      t => `expected '${t.text}' to be '}' ${t.posString}`
    );

    return body;
  }

  _letStatement() {
    this._pop();

    const identifier = this._popBySymbolOrThrow(
      IDENTIFIER,
      t => `expected '${t.text}' to be an identifier ${t.posString}`
    );

    const exp = this._expression(identifier.text);
    return new LetStatement(exp, identifier.text);
  }

  _expression(name) {
    switch (this._peek().symbol) {
      case LPAREN:
        return this._functionCall();
      case IF:
        return this._ifExpression();
      default:
        return this._literal(name);
    }
  }

  _functionCall() {
    this._pop();

    const fn = this._expression();

    const args = [];
    while (!this._done() && this._peek().symbol !== RPAREN) {
      args.push(this._expression());
    }

    this._popBySymbolOrThrow(
      RPAREN,
      t => `expected '${t.text}' to be ')' ${t.posString}`
    );

    return new FunctionCall(fn, args);
  }

  _ifExpression() {
    this._pop();

    const condition = this._expression();
    const then = this._scope();
    const ifExpression = new IfExpression(condition, then);

    let curr = ifExpression;
    while (!this._done() && this._peek().symbol === ELSIF) {
      this._pop();
      const condition = this._expression();
      const then = this._scope();
      const elsifExpression = new ElsifExpression(condition, then);
      curr.otherwise = elsifExpression;
      curr = elsifExpression;
    }

    if (!this._done() && this._peek().symbol === ELSE) {
      this._pop();
      const then = this._scope();
      const elseExpression = new ElseExpression(then);
      curr.otherwise = elseExpression;
    }

    return ifExpression;
  }

  _literal(name) {
    const next = this._pop();

    switch (next.symbol) {
      case INT:
        return new IntLiteral(next.text);
      case FLOAT:
        return new FloatLiteral(next.text);
      case STRING:
        return new StringLiteral(next.text);
      case TRUE:
        return new TrueLiteral();
      case FALSE:
        return new FalseLiteral();
      case NIL:
        return new NilLiteral();
      case LBRACKET:
        return this._function(name);
      case IDENTIFIER:
        return new IdentifierExpression(next.text);
      case VARARGS:
        return new VarArgsExpression(next.text.substr(1));
      default:
        throw new SyntaxError(
          `invalid syntax '${next.text}' ${next.posString}`
        );
    }
  }

  _function(name = "anonymous") {
    const { args, varargs } = this._functionArgs();

    return new FunctionExpression(name, this._scope(), args, varargs);
  }

  _functionArgs() {
    let varargs = false;
    let hasDefault = false;
    const args = [];
    const names = [];
    const noMoreArgs = () => this._done() || this._peek().symbol === RBRACKET;

    while (!noMoreArgs()) {
      const arg = this._pop();
      switch (arg.symbol) {
        case IDENTIFIER:
          if (names.includes(arg.text)) {
            throw new ParserError(
              `double argument error: '${arg.text}' already exists ${
                arg.posString
              }`
            );
          }

          if (this._peek() && this._peek().symbol === ASSIGN) {
            this._pop();
            if (noMoreArgs()) {
              throw new ParserError(
                `expected default value for argument: ${arg.text} ${
                  arg.posString
                }`
              );
            }

            args.push(
              new FunctionArgumentExpression(
                arg.text,
                this._expression(arg.text),
                true
              )
            );
            hasDefault = true;
          } else {
            if (hasDefault) {
              throw new ParserError(
                `a paramter without default value can't come after a parameter with default value: ${
                  arg.text
                } ${arg.posString}`
              );
            }
            args.push(
              new FunctionArgumentExpression(arg.text, new NilLiteral())
            );
            names.push(arg.text);
          }
          break;
        case VARARGS:
          if (names.includes(arg.text.substr(1))) {
            throw new ParserError(
              `double argument error: '${arg.text}' already exists ${
                arg.posString
              }`
            );
          }
          if (hasDefault) {
            throw new ParserError(
              `default parameters are not supported with @rest: ${
                arg.posString
              }`
            );
          }
          if (!noMoreArgs()) {
            throw new ParserError(
              `'${arg.text}' must be used as the last argument ${arg.posString}`
            );
          }
          varargs = true;
          args.push(new FunctionArgumentExpression(arg.text, new NilLiteral()));
          names.push(arg.text);
          break;
        default:
          throw new ParserError(
            `expected '${arg.text}' to be an identifier ${arg.posString}`
          );
      }
    }

    this._popBySymbolOrThrow(
      RBRACKET,
      t => `expected '${t.text}' to be ']' ${t.posString}`
    );

    return { args, varargs };
  }

  _done() {
    return this._tokens.length <= this._pos || this._peek().symbol === EOF;
  }

  _peek() {
    return this._tokens[this._pos];
  }

  _pop() {
    return this._tokens[this._pos++];
  }

  _popBySymbolOrThrow(expectedSymbol, errorMessage) {
    const next = this._pop();
    if (next.symbol !== expectedSymbol) {
      throw new ParserError(errorMessage(next));
    }

    return next;
  }
}

module.exports = Parser;
