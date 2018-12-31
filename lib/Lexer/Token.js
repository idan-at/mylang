const formatPos = require('./formatPos')

class Token {
  constructor(symbol, match, row, col) {
    this._symbol = symbol
    this._match = match
    this._row = row
    this._col = col
  }

  get symbol() {
    return this._symbol
  }

  get text() {
    return this._match
  }

  get pos() {
    return [this._row, this._col]
  }

  get posString() {
    return formatPos(this.pos)
  }
}

module.exports = Token
