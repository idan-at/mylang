class LimitedStackError extends Error {
  constructor(message) {
    super(message)
    this.stack = ''
    this.name = this.constructor.name
  }
}

class InvalidTokenError extends LimitedStackError {}
class ParserError extends LimitedStackError {}
class SyntaxError extends LimitedStackError {}
class TypeError extends LimitedStackError {}

module.exports = {
  InvalidTokenError,
  ParserError,
  SyntaxError,
  TypeError
}
