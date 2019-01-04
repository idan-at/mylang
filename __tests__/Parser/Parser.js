const Parser = require('../../lib/Parser')
const createLexer = require('../../lib/Lexer')
const {
  AST,
  LetStatement,
  IntLiteral,
  IfStatement,
  ElsifStatement,
  ElseStatement,
  FunctionCall,
  IdentifierExpression
} = require('../../lib/AST')
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

    it('parses an if-else statement correctly', () => {
      const tokens = withTokensFrom('if (= x 1) { 42 } else { 45 }')

      expect(parse(tokens)).toEqual(new AST([
        new IfStatement(
          new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(1)]),
          [new IntLiteral(42)],
          new ElseStatement(
            [new IntLiteral(45)],
            null
          )
        )
      ]))
    })

    it('parses an if-elsif statement correctly', () => {
      const tokens = withTokensFrom('if (= x 1) { 42 } elsif (= x 2) { 45 }')

      expect(parse(tokens)).toEqual(new AST([
        new IfStatement(
          new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(1)]),
          [new IntLiteral(42)],
          new ElsifStatement(
            new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(2)]),
            [new IntLiteral(45)],
            null
          )
        )
      ]))
    })

    it('parses an if-elsif-else statement correctly', () => {
      const tokens = withTokensFrom('if (= x 1) { 42 } elsif (= x 2) { 43 } elsif (= x 3) { 44 } else { 45 }')

      expect(parse(tokens)).toEqual(new AST([
        new IfStatement(
          new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(1)]),
          [new IntLiteral(42)],
          new ElsifStatement(
            new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(2)]),
            [new IntLiteral(43)],
            new ElsifStatement(
              new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(3)]),
              [new IntLiteral(44)],
              new ElseStatement(
                [new IntLiteral(45)],
                null
              )
            )
          )
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