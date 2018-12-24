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
  NIL
} = require('./symbols')

const lexerBuilder = new Builder()
const lexer = lexerBuilder.ignore(WHITESPACE, /^\s+/)
                          .ignore(COMMENT, /^\;.*/)
                          .add(LET, /^let/)
                          .add(LPAREN, /^\(/)
                          .add(RPAREN, /^\)/)
                          .add(LBRACKET, /^\[/)
                          .add(RBRACKET, /^\]/)
                          .add(LSCOPE, /^\{/)
                          .add(RSCOPE, /^\}/)
                          .add(RETURN, /^return/)
                          .add(INT, /^[\+-]?\d+/)
                          .add(FLOAT, /^[\+-]?\d+\.\d+/)
                          .add(STRING, /^\"[^\"]*\"/)
                          .add(TRUE, /^true/)
                          .add(FALSE, /^false/)
                          .add(NIL, /^nil/)
                          .add(IDENTIFIER, /^[_a-zA-Z]+/)
                          .build()   

module.exports = lexer
