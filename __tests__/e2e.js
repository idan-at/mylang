const {spawnSync} = require('child_process')
const {writeFileSync, unlinkFileSync} = require('fs')
const {resolve} = require('path')

describe('mylang E2E', () => {
  const fixturesFilePath = resolve(__dirname, '..', 'code.my')

  afterEach(() => { try { unlinkFileSync(fixturesFilePath) } catch(e) {} })

  test('runs the main function and exits with its return value', () => {
    const code = `
      ; main
      let main [] {
        (println "Hello, World!")
        return 42
      }`

    writeFileSync(fixturesFilePath, code, 'utf8')
    const {stdout, status} = spawnSync(`node . ${fixturesFilePath}`)

    expect(status).toBe(42)
    expect(stdout).toEqual("Hello, World!")
  })
})
