const fs = require("fs");
const createLexer = require("./lib/Lexer");
const Parser = require("./lib/Parser");
const vm = require("./lib/VM");
const { isInt, isNil } = require("./lib/VM/type-checks");
const { InvalidExitCodeError } = require("./lib/errors");
const format = require("./lib/VM/format");

function runFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const result = vm.main(parse(code));

  switch (true) {
    case isInt(result):
      process.exit(result);
    case isNil(result):
      process.exit(0);
    case result === undefined:
      process.exit(0);
    default:
      throw new InvalidExitCodeError(
        `main returned with '${format(result)}' (expected an int or nil)`
      );
  }
}

function repl() {
  const stdin = process.openStdin();

  process.stdout.write("> ");
  stdin.addListener("data", data => {
    const code = data.toString();
    try {
      const ast = parse(code);
      for (const statement of ast.iter) {
        const result = vm.runLine(statement);
        if (result !== undefined) {
          console.log(";", format(result));
        }
      }
    } catch (e) {
      console.error(e.toString());
    } finally {
      process.stdout.write("> ");
    }
  });
}

function parse(code) {
  const lexer = createLexer();
  const tokens = lexer.tokenize(code);
  const parser = new Parser(tokens);
  return parser.parse();
}

process.argv[2] ? runFile(process.argv[2]) : repl();
