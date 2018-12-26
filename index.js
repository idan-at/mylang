const fs = require('fs')
const createLexer = require('./lib/Lexer')
const Parser = require('./lib/Parser')
const vm = require('./lib/VM')

function runFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  vm.eval(parse(code))
  const result = vm.main()
  process.exit(result)
}

function repl() {
  const stdin = process.openStdin();

  process.stdout.write('> ')
  stdin.addListener('data', data => {
    const code = data.toString()
    try {
      const ast = parse(code)
      const result = vm.runLine(ast.first())
      if (result !== undefined) {
        console.log(';', result.toString())
      }
    } catch(e) {
      console.error(e)
    } finally {
      process.stdout.write('> ')
    }
  });
}

function parse(code) {
  const lexer = createLexer()
    const tokens = lexer.tokenize(code)
    const parser = new Parser()
    return parser.parse(tokens)
}

process.argv[2] ? runFile(process.argv[2]) : repl()
