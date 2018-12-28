const createLexer = require('../lib/Lexer')
const Token = require('../lib/Lexer/Token')
const {
  LET,
  LPAREN,
  RPAREN
} = require('../lib/Lexer/symbols')

describe('Lexer', () => {
  let Lexer

  beforeEach(() => lexer = createLexer())

  it('should properly tokenize let keyword', () => {
    const code = `let `

    expect(lexer.tokenize(code)).toEqual([new Token(LET, 'let ', 1, 1)])
  })

  it('should ignore whitespaces, tabs, new lines and commas', () => {
    const code = ' \t\n,,,,,\n'

    expect(lexer.tokenize(code)).toEqual([])
  })

  it('should skip the line after a comment', () => {
    const code = `; this is a comment line`

    expect(lexer.tokenize(code)).toEqual([])
  })

  it('should properly tokenize parenthesis', () => {
    const code = '()'

    expect(lexer.tokenize(code)).toEqual([
      new Token(LPAREN, '(', 1, 1),
      new Token(RPAREN, ')', 1, 2)
    ])
  })
})
