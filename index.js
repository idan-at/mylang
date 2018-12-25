const fs = require('fs')
const createLexer = require('./lib/Lexer')
const Parser = require('./lib/Parser')
const vm = require('./lib/VM')

function main(filePath) {
  if (filePath) {
    const code = fs.readFileSync(filePath, 'utf8')
    const lexer = createLexer()
    const tokens = lexer.tokenize(code)
    const parser = new Parser()
    const ast = parser.parse(tokens)  
    vm.eval(ast)
    const result = vm.main()

    // console.log(tokens)
    // console.log(require('util').inspect(ast, {depth: null}))
    // console.log(result)
    process.exit(result)
  }

  repl()
}

function repl() {
  const stdin = process.openStdin();

  process.stdout.write('> ')
  stdin.addListener('data', data => {
    const code = data.toString()
    try {
      const lexer = createLexer()
      const tokens = lexer.tokenize(code)
      const parser = new Parser()
      const ast = parser.parse(tokens)
      const result = vm.runLine(ast.first())
      if (result !== undefined) {
        console.log(';', result)
      }
    } catch(e) {
      console.error(e)
    } finally {
      process.stdout.write('> ')
    }
  });
}

main(process.argv[2])
