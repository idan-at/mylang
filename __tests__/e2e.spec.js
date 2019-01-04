const {spawnSync} = require('child_process')
const {writeFileSync, unlinkSync} = require('fs')
const {resolve} = require('path')

describe('mylang E2E', () => {
  const fixturesFilePath = resolve(__dirname, '..', 'code.my')

  afterEach(() => { try { unlinkSync(fixturesFilePath) } catch(e) {} })

  test('runs the main function and exits with its return value', () => {
    const code = `
      ; main
      let main [] {
        (println "Hello, World!")
        return 42
      }`

    writeFileSync(fixturesFilePath, code, 'utf8')
    const {status, stdout} = spawnSync('node', ['.', fixturesFilePath], {encoding: 'utf8'})

    expect(status).toBe(42)
    expect(stdout).toEqual("Hello, World!\n")
  })
})
