class Symbols {
  constructor(prev = null) {
    this._symbols = {}
    this._prev = prev
  }

  set(name, value) {
    this._symbols[name] = value
  }

  get(name) {
    const symbolInScope = this._symbols[name]

    if (symbolInScope !== undefined) {
      return symbolInScope
    }

    if (this._prev !== null) {
      return this._prev.get(name)
    }

    throw new Error(`${name} symbol does not exist`)
  }

  getOrUndefined(name) {
    const symbolInScope = this._symbols[name]

    if (symbolInScope !== undefined) {
      return symbolInScope
    }

    if (this._prev !== null) {
      return this._prev.getOrUndefined(name)
    }

    return undefined
  }
}

module.exports = Symbols