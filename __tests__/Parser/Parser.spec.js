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
      expect('let x 1').toParseTo([new LetStatement(new IntLiteral(1), 'x')])
    })

    it('throws ParseError when second token is not an identifier', () => {
      expect('let let 1').toFailParsing("expected 'let' to be an identifier (1:5)")
    })
  })

  describe('if statement', () => {
    it('parses simple if statement correctly', () => {
      expect('if (= x 1) { 42 }').toParseTo([
        new IfStatement(
          new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(1)]),
          [new IntLiteral(42)],
          null
        )
      ])
    })

    it('parses an if-else statement correctly', () => {
      expect('if (= x 1) { 42 } else { 45 }').toParseTo([
        new IfStatement(
          new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(1)]),
          [new IntLiteral(42)],
          new ElseStatement(
            [new IntLiteral(45)],
            null
          )
        )
      ])
    })

    it('parses an if-elsif statement correctly', () => {
      expect('if (= x 1) { 42 } elsif (= x 2) { 45 }').toParseTo([
        new IfStatement(
          new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(1)]),
          [new IntLiteral(42)],
          new ElsifStatement(
            new FunctionCall(new IdentifierExpression('='), [new IdentifierExpression('x'), new IntLiteral(2)]),
            [new IntLiteral(45)],
            null
          )
        )
      ])
    })

    it('parses an if-elsif-else statement correctly', () => {
      expect('if (= x 1) { 42 } elsif (= x 2) { 43 } elsif (= x 3) { 44 } else { 45 }').toParseTo([
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
      ])
    })

    it('throws when if body is not inside a scope ({...})', () => {
      expect('if (= x 1) 42').toFailParsing("expected '42' to be '{' (1:12)")
    })

    it('throws when elsif body is not inside a scope ({...})', () => {
      expect('if (= x 1) { 42 } elsif (= x 4) 43').toFailParsing("expected '43' to be '{' (1:33)")
    })

    it('throws when els body is not inside a scope ({...})', () => {
      expect('if (= x 1) { 42 } else 43').toFailParsing("expected '43' to be '{' (1:24)")
    })
  })

  describe('expressions', () => {
    describe('function call', () => {
      it('parses a simple function call correctly', () => {
        expect('(f)').toParseTo([new FunctionCall(new IdentifierExpression('f'), [])])
      })

      it('parses a simple function call with arguments correctly', () => {
        expect('(f x 2)').toParseTo([
          new FunctionCall(
            new IdentifierExpression('f'),
            [new IdentifierExpression('x'), new IntLiteral(2)]
          )
        ])
      })

      it('parses a dynamic function call correctly', () => {
        expect('((f) 1 2 3)').toParseTo([
          new FunctionCall(
            new FunctionCall(new IdentifierExpression('f'), []),
            [new IntLiteral(1), new IntLiteral(2), new IntLiteral(3)]
          )
        ])
      })

      it('throws a ParserError when function call does not end with a closing parenthesis', () => {
        expect('(f 1').toFailParsing("expected '' to be ')' (1:5)")
      })
    })

    describe('literals', () => {
      it('parses integer correctly', () => {
        expect('1').toParseTo([new IntLiteral(1)])
      })

      it('parses float correctly', () => {
        expect('-1.5').toParseTo([new FloatLiteral(-1.5)])
      })

      it('parses string correctly', () => {
        expect('"Hi"').toParseTo([new StringLiteral('"Hi"')])
      })

      it('parses true correctly', () => {
        expect('true').toParseTo([new TrueLiteral()])
      })

      it('parses false correctly', () => {
        expect('false').toParseTo([new FalseLiteral()])
      })

      it('parses nil correctly', () => {
        expect('nil').toParseTo([new NilLiteral()])
      })

      describe('function expression', () => {
        it('parses a one line function correctly', () => {
          expect('[] 42').toParseTo([
            new FunctionExpression(
              'anonymous',
              [new ReturnStatement(new IntLiteral(42))],
              [],
              false
            )
          ])
        })

        it('parses a multi line function correctly', () => {
          expect('[] { return 42 }').toParseTo([
            new FunctionExpression(
              'anonymous',
              [new ReturnStatement(new IntLiteral(42))],
              [],
              false
            )
          ])
        })

        it('parses a named function correctly', () => {
          expect('let func [] 42').toParseTo([
            new LetStatement(
              new FunctionExpression(
                'func',
                [new ReturnStatement(new IntLiteral(42))],
                [],
                false
              ),
              'func'
            )
          ])
        })

        it('parses function arguments correctly', () => {
          expect('[a b @c] 42').toParseTo([
            new FunctionExpression(
              'anonymous',
              [new ReturnStatement(new IntLiteral(42))],
              ['a', 'b', '@c'],
              true
            )
          ])
        })

        it('throws when function arguments list is not closed', () => {
          expect('[').toFailParsing("expected '' to be ']' (1:2)")
        })

        it('throws when the same argument name is used in two different args', () => {
          expect('[a a] 42').toFailParsing("double argument error: 'a' already exists (1:4)")
        })

        it('throws when the same argument name is used in an argument and varargs', () => {
          expect('[a @a] 42').toFailParsing("double argument error: '@a' already exists (1:4)")
        })

        it('throws when varargs is used as the non last parameter', () => {
          expect('[@a b] 42').toFailParsing("'@a' must be used as the last argument (1:2)")
        })

        it('throws when given argument is not an identifier', () => {
          expect('[4] 42').toFailParsing("expected '4' to be an identifier (1:2)")
        })
      })

      it('throws syntax error when expression is invalid', () => {
        expect('{').toThrowSyntaxErrorInParsing({suffix: "'{'", row: 1, col: 1})
      })
    })
  })
})
