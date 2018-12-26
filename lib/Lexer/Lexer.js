const Token = require('./Token')
const {InvalidTokenError} = require('../errors')

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
      const nextTokenPosition = `${this._row}:${this._col}`
      throw new InvalidTokenError(`Unexpected token: '${nextTokenText}' (${nextTokenPosition})`)
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

    return {token, newInput}
  }

  _handleIgnored(input, definition) {
    const newLinesCount = (input.match(/\n/g) || []).length

    if (newLinesCount > 0) {
      this._row += newLinesCount
      const lastNewLineIndex = input.lastIndexOf('\n')
      this._col += input.length - lastNewLineIndex
    } else {
      this._col += input.length
    }

    return this._getAdvancedInput(input, this._getMatch(input, definition))
  }

  _getMatch(input, definition) {
    return input.match(definition.regex)[0]
  }

  _getAdvancedInput(input, match) {
    return input.slice(match.length)
  }
}

module.exports = Lexer
