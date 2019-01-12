class LimitedStackError extends Error {
  constructor(message) {
    super(message);
    this.stack = "";
    this.name = this.constructor.name;
  }
}

class LexerError extends LimitedStackError {}
class InvalidTokenError extends LexerError {}

class ParserError extends LimitedStackError {}
class SyntaxError extends ParserError {}

class RuntimeError extends LimitedStackError {}
class TypeError extends RuntimeError {}
class DivisionByZeroError extends RuntimeError {}
class InvalidExitCodeError extends RuntimeError {}
class SymbolNotFound extends RuntimeError {}

module.exports = {
  InvalidTokenError,
  ParserError,
  SyntaxError,
  TypeError,
  DivisionByZeroError,
  InvalidExitCodeError,
  SymbolNotFound
};
