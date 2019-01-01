const formatPos = require('../../lib/Lexer/formatPos')
const Chance = require('chance')

const chance = new Chance()

describe('formatPos', () => {
  it('joins row and column to its printable format', () => {
    const row = chance.integer()
    const col = chance.integer()

    expect(formatPos([row, col])).toEqual(`(${row}:${col})`)
  })
})
