const fs = require('fs')
const lexer = require('./lib/Lexer')
const parser = require('./lib/Parser')
const vm = require('./lib/VM')

function main(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  const tokens = lexer.tokenize(code)
  const ast = parser.parse(tokens)  
  const result = vm.run(ast)

  // console.log(tokens)
  // console.log(require('util').inspect(ast, {depth: null}))
  // console.log(result)
  process.exit(result)
}

main(process.argv[2])
