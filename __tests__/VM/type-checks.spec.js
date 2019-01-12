const {
  isInt,
  isTrue,
  isFalse,
  isNil,
  isString,
  isBoolean,
  isFloat,
  isFunction,
  isList,
  isSet,
  isDict
} = require("../../lib/VM/type-checks");
const { FunctionExpression } = require("../../lib/AST");

describe("type-checks", () => {
  describe("isInt", () => {
    it("returns true when an integer is passed", () => {
      expect(isInt(42)).toBeTrue();
    });

    it("returns false when a non integer is passed", () => {
      expect(isInt(42.2)).toBeFalse();
    });
  });

  describe("isFloat", () => {
    it("returns true when a float is passed", () => {
      expect(isFloat(42.2)).toBeTrue();
    });

    it("returns false when a non float is passed", () => {
      expect(isFloat(42)).toBeFalse();
    });
  });

  describe("isNil", () => {
    it("returns true when null is passed", () => {
      expect(isNil(null)).toBeTrue();
    });

    it("returns false when null is not passed", () => {
      expect(isNil(42)).toBeFalse();
    });
  });

  describe("isTrue", () => {
    it("returns true when true is passed", () => {
      expect(isTrue(true)).toBeTrue();
    });

    it("returns false when true is not passed", () => {
      expect(isTrue(42.2)).toBeFalse();
    });
  });

  describe("isFalse", () => {
    it("returns true when false is passed", () => {
      expect(isFalse(false)).toBeTrue();
    });

    it("returns false when false is not passed", () => {
      expect(isFalse(42.2)).toBeFalse();
    });
  });

  describe("isBoolean", () => {
    it("returns true when true is passed", () => {
      expect(isBoolean(true)).toBeTrue();
    });

    it("returns true when false is passed", () => {
      expect(isBoolean(false)).toBeTrue();
    });

    it("returns false when true nor false are not passed", () => {
      expect(isBoolean(42.2)).toBeFalse();
    });
  });

  describe("isString", () => {
    it("returns true when a string is passed", () => {
      expect(isString("hi")).toBeTrue();
    });

    it("returns false when a non string is passed", () => {
      expect(isString(42.2)).toBeFalse();
    });
  });

  describe("isFunction", () => {
    it("returns true when a native function is passed", () => {
      expect(isFunction(() => {})).toBeTrue();
    });

    it("returns true when a user function is passed", () => {
      const userFunction = new FunctionExpression();

      expect(isFunction(userFunction)).toBeTrue();
    });

    it("returns false when false is not passed", () => {
      expect(isFunction(42.2)).toBeFalse();
    });
  });

  describe("isList", () => {
    it("returns true when a list is passed", () => {
      expect(isList([1, 2, 3])).toBeTrue();
    });

    it("returns false when a list is not passed", () => {
      expect(isList(42.2)).toBeFalse();
    });
  });

  describe("isSet", () => {
    it("returns true when a set is passed", () => {
      expect(isSet(new Set([1, 2, 3]))).toBeTrue();
    });

    it("returns false when a set is not passed", () => {
      expect(isSet(42.2)).toBeFalse();
    });
  });

  describe("isDict", () => {
    it("returns true when a dict is passed", () => {
      expect(isDict(new Map())).toBeTrue();
    });

    it("returns false when a dict is not passed", () => {
      expect(isDict(42.2)).toBeFalse();
    });
  });
});
