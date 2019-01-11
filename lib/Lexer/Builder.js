const Lexer = require("./Lexer");
const Definition = require("./Definition");

class Builder {
  constructor() {
    this._ignored = [];
    this._definitions = [];
  }

  ignore(symbol, regex) {
    this._ignored.push(new Definition(symbol, regex));
    return this;
  }

  add(symbol, regex) {
    this._definitions.push(new Definition(symbol, regex));
    return this;
  }

  build() {
    return new Lexer(this._definitions, this._ignored);
  }
}

module.exports = Builder;
