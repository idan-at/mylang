const Symbols = require("./Symbols");
const {
  LetStatement,
  IntLiteral,
  FloatLiteral,
  StringLiteral,
  NilLiteral,
  TrueLiteral,
  FalseLiteral,
  FunctionExpression,
  FunctionCall,
  IdentifierExpression,
  VarArgsExpression,
  IfExpression
} = require("../AST");
const globals = require("./globals");
const { TypeError } = require("../errors");
const format = require("./format");

class VM {
  constructor() {
    this._globals = globals;
  }

  main(ast) {
    this._eval(ast.iter, this._globals);
    const main = this._globals.get("main");
    return this._eval(main.iter, this._globals);
  }

  runLine(statement, symbols = this._globals) {
    switch (statement.constructor) {
      case LetStatement:
        return this._assign(statement.name, statement.expression, symbols);
      case IfExpression:
        return this._runIf(statement, symbols);
      default:
        return this._evalExp(statement, symbols);
    }
  }

  _assign(name, expression, symbols) {
    if (symbols.existsWithinScope(name)) {
      throw new Error(`identifier '${name}' already exists`);
    }

    symbols.set(name, this._evalExp(expression, symbols));
  }

  _runIf(statement, symbols) {
    const cond = this._evalExp(statement.condition, symbols);
    if (cond !== true && cond !== false) {
      throw new TypeError(
        `expected if to be called with a boolean, but it was called with ${format(
          cond
        )}`
      );
    }

    if (cond) {
      return this._eval(statement.iter, symbols);
    } else if (statement.otherwise) {
      return this._runIf(statement.otherwise, symbols);
    }
  }

  _eval(statements, symbols) {
    let result;

    for (const statement of statements) {
      result = this.runLine(statement, symbols);
    }

    return result;
  }

  _evalExp(expression, symbols) {
    switch (expression.constructor) {
      case IntLiteral:
      case FloatLiteral:
      case StringLiteral:
      case NilLiteral:
      case TrueLiteral:
      case FalseLiteral:
        return expression.value;
      case FunctionExpression:
        expression.closure = symbols;
        return expression;
      case FunctionCall:
        const f = this._evalExp(expression.fn, symbols);
        if (!(f instanceof FunctionExpression)) {
          throw new TypeError(`${expression.fn.name} is not a function`);
        }
        return this._call(f, expression.args, symbols);
      case IdentifierExpression:
        return symbols.get(expression.name);
      default:
        throw new Error("could not evaluate expression");
    }
  }

  _call(f, args, symbols) {
    if (!this._validFunctionCall(f, args)) {
      throw new Error(
        `${args.length} arguments passed to '${f.name}' (expected ${
          f.args.length
        })`
      );
    }

    const newSymbols = this._functionContext(f, args, symbols);

    if (typeof f.iter === "function") {
      return f.iter(newSymbols);
    }

    return this._eval(f.iter, newSymbols);
  }

  _functionContext(f, args, symbols) {
    const newSymbols = new Symbols(f.closure);

    if (f.varargs) {
      const rest = [];
      const restArgIndex = f.args.length - 1;
      newSymbols.set(f.argAt(restArgIndex).substr(1), rest);
      args.forEach((arg, idx) => {
        if (idx < restArgIndex) {
          newSymbols.set(f.argAt(idx), this._evalExp(arg, symbols));
        } else {
          try {
            rest.push(this._evalExp(arg, symbols));
          } catch (e) {
            if (arg instanceof VarArgsExpression) {
              rest.push(...symbols.get(arg.name));
            } else {
              throw e;
            }
          }
        }
      });
    } else {
      args.forEach((arg, idx) =>
        newSymbols.set(f.argAt(idx), this._evalExp(arg, symbols))
      );
    }

    return newSymbols;
  }

  _validFunctionCall(f, args) {
    if (f.varargs) {
      return args.length >= f.args.length - 1;
    }

    return args.length === f.args.length;
  }
}

module.exports = VM;
