const Builder = require("./Builder");
const {
  WHITESPACE,
  LET,
  LPAREN,
  RPAREN,
  LBRACKET,
  RBRACKET,
  LSCOPE,
  RSCOPE,
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
  ELSE,
  ASSIGN
} = require("./symbols");

module.exports = () => {
  const lexerBuilder = new Builder();
  const lexer = lexerBuilder
    .ignore(WHITESPACE, /^\s+/)
    .ignore(COMMENT, /^;.*/)
    .ignore(COMMA, /^,/)
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
    .add(FLOAT, /^[+-]?\d+\.\d+/)
    .add(INT, /^[+-]?\d+/)
    .add(STRING, /^"[^"]*"/)
    .add(IDENTIFIER, /^(nil|true|false)\?/)
    .add(TRUE, /^true/)
    .add(FALSE, /^false/)
    .add(NIL, /^nil/)
    .add(ASSIGN, /^=\s+/)
    .add(VARARGS, /^@[_a-zA-Z][_a-zA-Z0-9]*/)
    .add(IDENTIFIER, /^[+\-\\*/|&~<>?=!_a-zA-Z][+\-\\*/|&~<>?=!_a-zA-Z0-9]*/)
    .build();

  return lexer;
};
