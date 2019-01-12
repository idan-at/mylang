const { SymbolNotFound } = require("../errors");

class Symbols {
  constructor(prev = null) {
    this._symbols = {};
    this._prev = prev;
  }

  setClosure(prev) {
    if (this._prev === null) {
      this._prev = prev;
    } else {
      this._prev.setClosure(prev);
    }
  }

  set(name, value) {
    this._symbols[name] = value;
  }

  get(name) {
    const symbolInScope = this._symbols[name];

    if (symbolInScope !== undefined) {
      return symbolInScope;
    }

    if (this._prev !== null) {
      return this._prev.get(name);
    }

    throw new SymbolNotFound(`${name} symbol does not exist`);
  }

  existsWithinScope(name) {
    return this._symbols[name] !== undefined;
  }
}

module.exports = Symbols;
