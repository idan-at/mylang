const Symbols = require("../../lib/VM/Symbols");
const Chance = require("chance");
const { SymbolNotFound } = require("../../lib/errors");

const chance = new Chance();

describe("Symbols", () => {
  const symbolName = chance.word();
  const symbolValue = chance.integer();

  it("allows setting and getting symbols", () => {
    const symbols = new Symbols();

    expect(() => symbols.get(symbolName)).toThrow(
      SymbolNotFound,
      `${symbolName} symbol does not exist`
    );

    symbols.set(symbolName, symbolValue);
    expect(symbols.get(symbolName)).toBe(symbolValue);
  });

  it("searches symbols in parent symbols", () => {
    const symbols = new Symbols();
    const parent = new Symbols();

    symbols.setClosure(parent);

    parent.set(symbolName, symbolValue);

    expect(symbols.existsWithinScope(symbolName)).toBeFalse();
    expect(symbols.get(symbolName)).toBe(symbolValue);
  });
});
