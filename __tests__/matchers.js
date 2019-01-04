const createLexer = require('../lib/Lexer')
const { EOF } = require('../lib/Lexer/symbols')
const Token = require('../lib/Lexer/Token')
const { InvalidTokenError, SyntaxError, ParserError } = require('../lib/errors')
const Parser = require('../lib/Parser')
const { AST } = require('../lib/AST')

require('jest-extended')

expect.extend({
  toTokenizeTo(code, list) {
    const lastToken = new Token(EOF, '', expect.any(Number), expect.any(Number))
    expect(tokenize(code)).toEqual([...list, lastToken])

    return {pass: true}
  },

  toFailTokenizing(code, errorMessage) {
    expect(() => tokenize(code)).toThrowWithMessage(InvalidTokenError, errorMessage)

    return {pass: true}
  },

  toParseTo(code, astBody) {
    expect(parse(code)).toEqual(new AST(astBody))

    return {pass: true}
  },

  toThrowSyntaxErrorInParsing(code, {suffix, row, col}) {
    expect(() => parse(code)).toThrowWithMessage(SyntaxError, `invalid syntax ${suffix} (${row}:${col})`)

    return {pass: true}
  },

  toFailParsing(code, errorMessage) {
    expect(() => parse(code)).toThrowWithMessage(ParserError, errorMessage)

    return {pass: true}
  }
})

function tokenize(code) {
  const lexer = createLexer()
  return lexer.tokenize(code)
}

function parse(code) {
  const tokens = tokenize(code)
  return new Parser().parse(tokens)
}
