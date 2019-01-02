const Parser = require('../../lib/Parser')
const createLexer = require('../../lib/Lexer')
const { AST, LetStatement, IntLiteral, IfStatement, FunctionCall, IdentifierExpression } = require('../../lib/AST')
const { ParserError } = require('../../lib/errors')

describe('Parser', () => {
  describe('let statement', () => {
    it('parses let statement correctly', () => {
      const tokens = withTokensFrom('let x 1')

      expect(parse(tokens)).toEqual(new AST([
        new LetStatement(
          new IntLiteral(1),
          'x'
        )
      ]))
    })

    it('throws ParseError when second token is not an identifier', () => {
      const tokens = withTokensFrom('let let 1')

      expect(() => parse(tokens))
        .toThrowWithMessage(ParserError, "expected 'let' to be an identifier (1:5)")
    })
  })

  describe('if statement', () => {
    it('parses simple if statement correctly', () => {
      const tokens = withTokensFrom('if (= x 1) { 42 }')

      expect(parse(tokens)).toEqual(new AST([
        new IfStatement(
          new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(1)]),
          [new IntLiteral(42)],
          null
        )
      ]))
    })

    
  })
})

function withTokensFrom(code) {
  return createLexer().tokenize(code)
}

function parse(tokens) {
  const parser = new Parser()

  return parser.parse(tokens)
}