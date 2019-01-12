const format = require("../../lib/VM/format");
const Chance = require('chance');

const chance = new Chance()

describe('format', () => {
  it("returns 'nil' for null", () => {
    expect(format(null)).toBe("nil")
  })

  it("returns 'list ...arsgs' for a list", () => {
    expect(format([1, 2, 3])).toBe("[1 2 3]")
  })

  it("returns '{...arsgs}' for a set", () => {
    expect(format(new Set([1, 2, 3]))).toBe("{1 2 3}")
  })

  it("returns '{key: value....}' pairs for a dict", () => {
    const dict = new Map()
    dict.set("a", 1)
    dict.set("b", "hi")
    expect(format(dict)).toBe('{a:1 b:hi}')
  })

  it("returns object toString otherwise", () => {
    const expected = chance.string()
    const obj = {toString: () => expected}

    expect(format(obj)).toBe(expected)
  })
});
