const Builder = require('./Builder')
const Token = require('./Token')
const {
  WHITESPACE,
  LET,
  LPAREN,
  RPAREN,
  LBRACKET,
  RBRACKET,
  LSCOPE,
  RSCOPE,
  RETURN,
  IDENTIFIER,
  COMMENT,
  INT,
  FLOAT,
  STRING,
  TRUE,
  FALSE,
  NIL,
  COMMA,
  VARARGS,
  IF,
  ELSIF,
  ELSE
} = require('./symbols')

module.exports = () => {
  const lexerBuilder = new Builder()
  const lexer = lexerBuilder.ignore(WHITESPACE, /^\s+/)
                            .ignore(COMMENT, /^\;.*/)
                            .ignore(COMMA, /^\,/)
                            .add(LET, /^let\s+/)
                            .add(LPAREN, /^\(/)
                            .add(RPAREN, /^\)/)
                            .add(LBRACKET, /^\[/)
                            .add(RBRACKET, /^\]/)
                            .add(LSCOPE, /^\{/)
                            .add(RSCOPE, /^\}/)
                            .add(IF, /^if\s+/)
                            .add(ELSIF, /^elsif\s+/)
                            .add(ELSE, /^else\s+/)
                            .add(RETURN, /^return\s+/)
                            .add(FLOAT, /^[\+-]?\d+\.\d+/)
                            .add(INT, /^[\+-]?\d+/)
                            .add(STRING, /^\"[^\"]*\"/)
                            .add(IDENTIFIER, /^(nil|true|false)\?/)
                            .add(TRUE, /^true/)
                            .add(FALSE, /^false/)
                            .add(NIL, /^nil/)
                            .add(VARARGS, /^\@[_a-zA-Z][_a-zA-Z0-9]*/)
                            .add(IDENTIFIER, /^[\+\-\\*\/\|\&\~\<\>\?\=\!_a-zA-Z][\+\-\\*\/\|\&\~\<\>\?\=\!_a-zA-Z0-9]*/)
                            .build()

  return lexer
}
