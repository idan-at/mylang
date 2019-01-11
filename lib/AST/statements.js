class Statement {
  constructor(expression) {
    this._expression = expression;
  }

  get expression() {
    return this._expression;
  }
}

class LetStatement extends Statement {
  constructor(expression, identifier) {
    super(expression);
    this._identifier = identifier;
  }

  get name() {
    return this._identifier;
  }

  toString() {
    return `let ${this.name} ${this._expression.toString()}`;
  }
}

module.exports = {
  LetStatement
};
