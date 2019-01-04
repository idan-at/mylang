const createLexer = require('../../lib/Lexer')
const Token = require('../../lib/Lexer/Token')
const {
  LET,
  LPAREN,
  RPAREN,
  LBRACKET,
  RBRACKET,
  LSCOPE,
  RSCOPE,
  IF,
  ELSIF,
  ELSE,
  RETURN,
  NIL,
  TRUE,
  FALSE,
  INT,
  FLOAT,
  STRING,
  IDENTIFIER,
  VARARGS
} = require('../../lib/Lexer/symbols')
const {InvalidTokenError} = require('../../lib/errors')

describe('Lexer', () => {
  let Lexer

  beforeEach(() => lexer = createLexer())

  describe('keywords', () => {
    it('should properly tokenize let keyword', () => {
      const code = `let `
  
      expect(code).toTokenizeTo([new Token(LET, 'let ', 1, 1)])
    })

    it('should properly tokenize if keyword', () => {
      const code = `if `
  
      expect(code).toTokenizeTo([new Token(IF, 'if ', 1, 1)])
    })
  
    it('should properly tokenize if keyword', () => {
      const code = `elsif `
  
      expect(code).toTokenizeTo([new Token(ELSIF, 'elsif ', 1, 1)])
    })
  
    it('should properly tokenize if keyword', () => {
      const code = `else `
  
      expect(code).toTokenizeTo([new Token(ELSE, 'else ', 1, 1)])
    })
  
    it('should properly tokenize return keyword', () => {
      const code = `return `
  
      expect(code).toTokenizeTo([new Token(RETURN, 'return ', 1, 1)])
    })
  })

  describe('brackets', () => {
    it('should properly tokenize parenthesis', () => {
      const code = '()'
  
      expect(code).toTokenizeTo([
        new Token(LPAREN, '(', 1, 1),
        new Token(RPAREN, ')', 1, 2)
      ])
    })
  
    it('should properly tokenize brackets', () => {
      const code = '[]'
  
      expect(code).toTokenizeTo([
        new Token(LBRACKET, '[', 1, 1),
        new Token(RBRACKET, ']', 1, 2)
      ])
    })
  
    it('should properly tokenize curly brackets', () => {
      const code = '{}'
  
      expect(code).toTokenizeTo([
        new Token(LSCOPE, '{', 1, 1),
        new Token(RSCOPE, '}', 1, 2)
      ])
    })
  })

  describe('ignored patterns', () => {
    it('should ignore white spaces, tabs, new lines and commas', () => {
      const code = ' \t\n,,,,,\n'
  
      expect(code).toTokenizeTo([])
    })
  
    it('should skip the line after a comment', () => {
      const code = `; this is a comment line`
  
      expect(code).toTokenizeTo([])
    })
  })

  describe('literals', () => {
    it('should properly tokenize nil literal', () => {
      const code = `nil`
  
      expect(code).toTokenizeTo([new Token(NIL, 'nil', 1, 1)])
    })

    it('should properly tokenize true literal', () => {
      const code = `true`
  
      expect(code).toTokenizeTo([new Token(TRUE, 'true', 1, 1)])
    })

    it('should properly tokenize false literal', () => {
      const code = `false`
  
      expect(code).toTokenizeTo([new Token(FALSE, 'false', 1, 1)])
    })

    it('should properly tokenize a string literal', () => {
      const code = `"Hello, World!"`
  
      expect(code).toTokenizeTo([new Token(STRING, '"Hello, World!"', 1, 1)])
    })

    it('should properly tokenize an int literal', () => {
      const code = `45`
  
      expect(code).toTokenizeTo([new Token(INT, '45', 1, 1)])
    })

    it('should properly tokenize a negative int literal', () => {
      const code = `-42`
  
      expect(code).toTokenizeTo([new Token(INT, '-42', 1, 1)])
    })

    it('should properly tokenize an int literal with redundant plus sign', () => {
      const code = `+42`
  
      expect(code).toTokenizeTo([new Token(INT, '+42', 1, 1)])
    })

    it('should properly tokenize a float literal', () => {
      const code = `42.4`
  
      expect(code).toTokenizeTo([new Token(FLOAT, '42.4', 1, 1)])
    })

    it('should properly tokenize a negative float literal', () => {
      const code = `-42.4`
  
      expect(code).toTokenizeTo([new Token(FLOAT, '-42.4', 1, 1)])
    })

    it('should properly tokenize a float literal with redundant plus sign', () => {
      const code = `+42.4`
  
      expect(code).toTokenizeTo([new Token(FLOAT, '+42.4', 1, 1)])
    })
  })

  describe('identifiers', () => {
    describe('type checkers', () => {
      it('should properly tokenize nil?', () => {
        const code = `nil?`
    
        expect(code).toTokenizeTo([new Token(IDENTIFIER, 'nil?', 1, 1)])
      })

      it('should properly tokenize true?', () => {
        const code = `true?`
    
        expect(code).toTokenizeTo([new Token(IDENTIFIER, 'true?', 1, 1)])
      })

      it('should properly tokenize false?', () => {
        const code = `false?`
    
        expect(code).toTokenizeTo([new Token(IDENTIFIER, 'false?', 1, 1)])
      })
    })

    it('should properly tokenize an identifier', () => {
      const code = `main`
  
      expect(code).toTokenizeTo([new Token(IDENTIFIER, 'main', 1, 1)])
    })

    it('should properly tokenize an identifier with special characters', () => {
      const code = `hi+-*/|&~<>=!_`
  
      expect(code).toTokenizeTo([new Token(IDENTIFIER, 'hi+-*/|&~<>=!_', 1, 1)])
    })

    it('should properly tokenize an identifier which includes numbers, but does not start with a number', () => {
      const code = '0 main2'

      expect(code).toTokenizeTo([
        new Token(INT, '0', 1, 1),
        new Token(IDENTIFIER, 'main2', 1, 3)
      ])
    })
  })

  describe('functions', () => {
    it('should properly tokenize a one line function declaration', () => {
      const code = 'let f [] 4'

      expect(code).toTokenizeTo([
        new Token(LET, 'let ', 1, 1),
        new Token(IDENTIFIER, 'f', 1, 5),
        new Token(LBRACKET, '[', 1, 7),
        new Token(RBRACKET, ']', 1, 8),
        new Token(INT, '4', 1, 10)
      ])
    })

    it('should properly tokenize a multi line function declaration', () => {
      const code = `let f [] {\n  return 45\n}`

      expect(code).toTokenizeTo([
        new Token(LET, 'let ', 1, 1),
        new Token(IDENTIFIER, 'f', 1, 5),
        new Token(LBRACKET, '[', 1, 7),
        new Token(RBRACKET, ']', 1, 8),
        new Token(LSCOPE, '{', 1, 10),
        new Token(RETURN, 'return ', 2, 3),
        new Token(INT, '45', 2, 10),
        new Token(RSCOPE, '}', 3, 1)
      ])
    })

    it('should properly tokenize function arguments', () => {
      const code = '[a b @c]'

      expect(code).toTokenizeTo([
        new Token(LBRACKET, '[', 1, 1),
        new Token(IDENTIFIER, 'a', 1, 2),
        new Token(IDENTIFIER, 'b', 1, 4),
        new Token(VARARGS, '@c', 1, 6),
        new Token(RBRACKET, ']', 1, 8)
      ])
    })
  })

  it('throws when no match is found', () => {
    const code = '#'

    expect(code)
    .toFailTokenizing("unexpected token '#' (1:1)")
  })
})
