const Parser = require('../../lib/Parser')
const createLexer = require('../../lib/Lexer')
const {
  AST,
  LetStatement,
  ReturnStatement,
  FloatLiteral,
  StringLiteral,
  IntLiteral,
  FunctionExpression,
  TrueLiteral,
  FalseLiteral,
  NilLiteral,
  IfStatement,
  ElsifStatement,
  ElseStatement,
  FunctionCall,
  IdentifierExpression
} = require('../../lib/AST')
const { ParserError, SyntaxError } = require('../../lib/errors')

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

    it('throws when if body is not inside a scope ({...})', () => {
      const tokens = withTokensFrom('if (= x 1) 42')

      expect(() => parse(tokens)).toThrowWithMessage(ParserError, "expected '42' to be '{' (1:12)")
    })

    it('throws when elsif body is not inside a scope ({...})', () => {
      const tokens = withTokensFrom('if (= x 1) { 42 } elsif (= x 4) 43')

      expect(() => parse(tokens)).toThrowWithMessage(ParserError, "expected '43' to be '{' (1:33)")
    })

    it('throws when els body is not inside a scope ({...})', () => {
      const tokens = withTokensFrom('if (= x 1) { 42 } else 43')

      expect(() => parse(tokens)).toThrowWithMessage(ParserError, "expected '43' to be '{' (1:24)")
    })
  })

  describe('expressions', () => {
    describe('function call', () => {
      it('parses a simple function call correctly', () => {
        const tokens = withTokensFrom('(f)')

        expect(parse(tokens)).toEqual(new AST([
          new FunctionCall(new IdentifierExpression('f'), [])
        ]))
      })

      it('parses a simple function call with arguments correctly', () => {
        const tokens = withTokensFrom('(f x 2)')
  
        expect(parse(tokens)).toEqual(new AST([
          new FunctionCall(
            new IdentifierExpression('f'),
            [new IdentifierExpression('x'), new IntLiteral(2)]
          )
        ]))
      })

      it('parses a dynamic function call correctly', () => {
        const tokens = withTokensFrom('((f) 1 2 3)')

        expect(parse(tokens)).toEqual(new AST([
          new FunctionCall(
            new FunctionCall(new IdentifierExpression('f'), []),
            [new IntLiteral(1), new IntLiteral(2), new IntLiteral(3)]
          )
        ]))
      })

      it('throws a ParserError when function call does not end with a closing parenthesis', () => {
        const tokens = withTokensFrom('(f 1')

        expect(() => parse(tokens)).toThrowWithMessage(ParserError, "expected '' to be ')' (1:5)")
      })
    })

    describe('literals', () => {
      it('parses integer correctly', () => {
        const tokens = withTokensFrom('1')

        expect(parse(tokens)).toEqual(new AST([
          new IntLiteral(1)
        ]))
      })

      it('parses float correctly', () => {
        const tokens = withTokensFrom('-1.5')

        expect(parse(tokens)).toEqual(new AST([
          new FloatLiteral(-1.5)
        ]))
      })

      it('parses string correctly', () => {
        const tokens = withTokensFrom('"Hi"')

        expect(parse(tokens)).toEqual(new AST([
          new StringLiteral('"Hi"')
        ]))
      })

      it('parses true correctly', () => {
        const tokens = withTokensFrom('true')

        expect(parse(tokens)).toEqual(new AST([
          new TrueLiteral()
        ]))
      })

      it('parses false correctly', () => {
        const tokens = withTokensFrom('false')

        expect(parse(tokens)).toEqual(new AST([
          new FalseLiteral()
        ]))
      })

      it('parses nil correctly', () => {
        const tokens = withTokensFrom('nil')

        expect(parse(tokens)).toEqual(new AST([
          new NilLiteral()
        ]))
      })

      describe('function expression', () => {
        it('parses a one line function correctly', () => {
          const tokens = withTokensFrom('[] 42')
          
          expect(parse(tokens)).toEqual(new AST([
            new FunctionExpression(
              'anonymous',
              [new ReturnStatement(new IntLiteral(42))],
              [],
              false
            )
          ]))
        })

        it('parses a multi line function correctly', () => {
          const tokens = withTokensFrom('[] { return 42 }')

          expect(parse(tokens)).toEqual(new AST([
            new FunctionExpression(
              'anonymous',
              [new ReturnStatement(new IntLiteral(42))],
              [],
              false
            )
          ]))
        })

        it('parses a named function correctly', () => {
          const tokens = withTokensFrom('let func [] 42')

          expect(parse(tokens)).toEqual(new AST([
            new LetStatement(
              new FunctionExpression(
                'func',
                [new ReturnStatement(new IntLiteral(42))],
                [],
                false
              ),
              'func'
            )
          ]))
        })

        it('parses function arguments correctly', () => {
          const tokens = withTokensFrom('[a b @c] 42')

          expect(parse(tokens)).toEqual(new AST([
            new FunctionExpression(
              'anonymous',
              [new ReturnStatement(new IntLiteral(42))],
              ['a', 'b', '@c'],
              true
            )
          ]))
        })

        it('throws when function arguments list is not closed', () => {
          const tokens = withTokensFrom('[')

          expect(() => parse(tokens)).toThrowWithMessage(ParserError, "expected '' to be ']' (1:2)")
        })

        it('throws when the same argument name is used in two different args', () => {
          const tokens = withTokensFrom('[a a] 42')

          expect(() => parse(tokens)).toThrowWithMessage(ParserError, "double argument error: 'a' already exists (1:4)")
        })

        it('throws when the same argument name is used in an argument and varargs', () => {
          const tokens = withTokensFrom('[a @a] 42')

          expect(() => parse(tokens)).toThrowWithMessage(ParserError, "double argument error: '@a' already exists (1:4)")
        })

        it('throws when varargs is used as the non last parameter', () => {
          const tokens = withTokensFrom('[@a b] 42')

          expect(() => parse(tokens)).toThrowWithMessage(ParserError, "'@a' must be used as the last argument (1:2)")
        })

        it('throws when given argument is not an identifier', () => {
          const tokens = withTokensFrom('[4] 42')

          expect(() => parse(tokens)).toThrowWithMessage(ParserError, "expected '4' to be an identifier (1:2)")
        })
      })

      it('throws syntax error when expression is invalid', () => {
        const tokens = withTokensFrom('{')

        expect(() => parse(tokens)).toThrowWithMessage(SyntaxError, "invalid syntax '{' (1:1)")
      })
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
