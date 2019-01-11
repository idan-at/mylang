const Scope = require("./Scope");
const { TrueLiteral } = require("./literals");

class Expression {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  toString() {
    return this.name;
  }
}

class FunctionCall extends Expression {
  constructor(fn, args = []) {
    super("anonymous");
    this._fn = fn;
    this._args = args;
  }

  get fn() {
    return this._fn;
  }

  get args() {
    return this._args;
  }

  toString() {
    return `(${this.fn.name}${this.toStringArgs()})`;
  }

  toStringArgs() {
    if (this.args.length > 0) {
      return ` ${this.args.join(" ")}`;
    }

    return "";
  }
}

class IdentifierExpression extends Expression {}
class VarArgsExpression extends Expression {}

class ConditionalExpression extends Scope {
  constructor(condition, body, otherwise = null) {
    super(body);
    this._condition = condition;
    this._otherwise = otherwise;
  }

  get condition() {
    return this._condition;
  }

  get otherwise() {
    return this._otherwise;
  }

  set otherwise(newOtherwise) {
    this._otherwise = newOtherwise;
  }
}

class IfExpression extends ConditionalExpression {}
class ElsifExpression extends ConditionalExpression {}
class ElseExpression extends ConditionalExpression {
  constructor(body) {
    super(new TrueLiteral(), body);
  }
}


module.exports = {
  FunctionCall,
  IdentifierExpression,
  VarArgsExpression,
  IfExpression,
  ElsifExpression,
  ElseExpression
};
