const Token = require('./Token')
const {InvalidTokenError} = require('../errors')
const formatPos = require('./formatPos')

class Lexer {
  constructor(definitions, ignored) {
    this._definitions = definitions
    this._ignored = ignored
    this._row = 1
    this._col = 1
  }

  tokenize(input) {
    if (input === '') {
      return []
    }

    const ignored = this._find(input, this._ignored)
    if (ignored) {
      const newInput = this._handleIgnored(input, ignored)
      return this.tokenize(newInput)
    }

    const definition = this._find(input, this._definitions)
    if (!definition) {
      const nextTokenText = input.split(/\s/)[0]
      const nextTokenPosition = formatPos([this._row, this._col])
      throw new InvalidTokenError(`unexpected token '${nextTokenText}' ${nextTokenPosition}`)
    }

    const {token, newInput} = this._handleToken(input, definition)
    return [token, ...this.tokenize(newInput)]
  }

  _find(input, tokens) {
    return tokens.find(token => input.search(token.regex) === 0)
  }

  _handleToken(input, definition) {
    const match = this._getMatch(input, definition)

    const newInput = this._getAdvancedInput(input, match)
    const token = new Token(definition.symbol, match, this._row, this._col)

    this._advanceRowAndCol(match)
    return {token, newInput}
  }

  _handleIgnored(input, definition) {
    const match = this._getMatch(input, definition)
    this._advanceRowAndCol(match)
    return this._getAdvancedInput(input, match)
  }

  _advanceRowAndCol(match) {
    const newLinesCount = (match.match(/\n/g) || []).length

    if (newLinesCount > 0) {
      this._row += newLinesCount
      this._col = 1
      const lastNewLineIndex = match.lastIndexOf('\n')
      this._col += match.length - lastNewLineIndex - 1
    } else {
      this._col += match.length
    }
  }

  _getMatch(input, definition) {
    return input.match(definition.regex)[0]
  }

  _getAdvancedInput(input, match) {
    return input.slice(match.length)
  }
}

module.exports = Lexer
