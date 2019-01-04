const createLexer = require('../lib/Lexer')
const { EOF } = require('../lib/Lexer/symbols')
const Token = require('../lib/Lexer/Token')
const { InvalidTokenError } = require('../lib/errors')

require('jest-extended')

expect.extend({
  toTokenizeTo(code, list) {
    const lexer = createLexer()
    const lastToken = new Token(EOF, '', expect.any(Number), expect.any(Number))
    expect(lexer.tokenize(code)).toEqual([...list, lastToken])

    return {pass: true}
  },

  toFailTokenizing(code, errorMessage) {
    const lexer = createLexer()
    expect(() => lexer.tokenize(code)).toThrowWithMessage(InvalidTokenError, errorMessage)

    return {pass: true}
  }
})