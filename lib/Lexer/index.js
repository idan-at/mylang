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
  COMMA
} = require('./symbols')

module.exports = () => {
  const lexerBuilder = new Builder()
  const lexer = lexerBuilder.ignore(WHITESPACE, /^\s+/)
                            .ignore(COMMENT, /^\;.*/)
                            .ignore(COMMA, /^\,/)
                            .add(LET, /^let/)
                            .add(LPAREN, /^\(/)
                            .add(RPAREN, /^\)/)
                            .add(LBRACKET, /^\[/)
                            .add(RBRACKET, /^\]/)
                            .add(LSCOPE, /^\{/)
                            .add(RSCOPE, /^\}/)
                            .add(RETURN, /^return/)
                            .add(FLOAT, /^[\+-]?\d+\.\d+/)
                            .add(INT, /^[\+-]?\d+/)
                            .add(STRING, /^\"[^\"]*\"/)
                            .add(IDENTIFIER, /^(nil|true|false|string|int|float)\?/)
                            .add(TRUE, /^true/)
                            .add(FALSE, /^false/)
                            .add(NIL, /^nil/)
                            .add(IDENTIFIER, /^[\+\-\\*\|\&\~\<\>\?_a-zA-Z]+/)
                            .build()

  return lexer
}
