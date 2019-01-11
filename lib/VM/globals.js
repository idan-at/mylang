const Symbols = require("./Symbols");
const { FunctionExpression } = require("../AST");
const {
  isNil,
  isTrue,
  isFalse,
  isString,
  isBoolean,
  isInt,
  isFloat,
  isFunction,
  isList,
  isSet,
  isDict
} = require("./type-checks");
const format = require("./format");
const { INT, FLOAT, BOOLEAN } = require("./types");
const { TypeError, DivisionByZeroError } = require("../errors");

const globals = new Symbols();

function createGlobalFunction(name, args, fn, varargs = false) {
  globals.set(
    name,
    new FunctionExpression(
      name,
      symbols => {
        const fArgs = args
          .map(arg => (arg.startsWith("@") ? arg.substr(1) : arg))
          .map(arg => symbols.get(arg));
        return fn(symbols, ...fArgs);
      },
      args,
      varargs
    )
  );
}

function validateType(arg, validators) {
  const passed = validators.some(({ fn }) => fn(arg.value));
  if (!passed) {
    const types = validators
      .map(v => v.typeName)
      .map(typeName => `'${typeName}'`);
    throw new TypeError(
      `expected '${arg.name}' to be of one of the types [${types.join(" ")}]`
    );
  }
}

// Prints
createGlobalFunction("println", ["item"], (_, item) =>
  console.log(format(item))
);

// Math
createGlobalFunction(
  "+",
  ["a", "b", "@rest"],
  (_, a, b, rest) => {
    validateType({ value: a, name: "a" }, [
      { fn: isInt, typeName: INT },
      { fn: isFloat, typeName: FLOAT }
    ]);
    validateType({ value: b, name: "b" }, [
      { fn: isInt, typeName: INT },
      { fn: isFloat, typeName: FLOAT }
    ]);
    rest.forEach((arg, idx) => {
      validateType({ value: arg, name: `@rest[${idx}]` }, [
        { fn: isInt, typeName: INT },
        { fn: isFloat, typeName: FLOAT }
      ]);
    });
    return [a, b, ...rest].reduce((acc, x) => acc + x, 0);
  },
  true
);

createGlobalFunction("-", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  return a - b;
});

createGlobalFunction(
  "*",
  ["a", "b", "@rest"],
  (_, a, b, rest) => {
    validateType({ value: a, name: "a" }, [
      { fn: isInt, typeName: INT },
      { fn: isFloat, typeName: FLOAT }
    ]);
    validateType({ value: b, name: "b" }, [
      { fn: isInt, typeName: INT },
      { fn: isFloat, typeName: FLOAT }
    ]);
    rest.forEach((arg, idx) => {
      validateType({ value: arg, name: `@rest[${idx}]` }, [
        { fn: isInt, typeName: INT },
        { fn: isFloat, typeName: FLOAT }
      ]);
    });
    return [a, b, ...rest].reduce((acc, x) => acc * x, 1);
  },
  true
);

createGlobalFunction("/", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  if (b === 0) {
    throw new DivisionByZeroError("division by zero");
  }
  return a / b;
});

createGlobalFunction("pow", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  return a ** b;
});

createGlobalFunction("mod", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  if (b === 0) {
    throw new DivisionByZeroError("modolo by zero");
  }
  return a % b;
});

// Bitwise
createGlobalFunction(
  "|",
  ["a", "b", "@rest"],
  (_, a, b, rest) => {
    validateType({ value: a, name: "a" }, [{ fn: isInt, typeName: INT }]);
    validateType({ value: b, name: "b" }, [{ fn: isInt, typeName: INT }]);
    rest.forEach((arg, idx) => {
      validateType({ value: arg, name: `@rest[${idx}]` }, [
        { fn: isInt, typeName: INT }
      ]);
    });

    return [a, b, ...rest].reduce((acc, x) => acc | x, 0);
  },
  true
);

createGlobalFunction(
  "&",
  ["a", "b", "@rest"],
  (_, a, b, rest) => {
    validateType({ value: a, name: "a" }, [{ fn: isInt, typeName: INT }]);
    validateType({ value: b, name: "b" }, [{ fn: isInt, typeName: INT }]);
    rest.forEach((arg, idx) => {
      validateType({ value: arg, name: `@rest[${idx}]` }, [
        { fn: isInt, typeName: INT }
      ]);
    });

    return [a, b, ...rest].reduce((acc, x) => acc & x, 1);
  },
  true
);

createGlobalFunction("~", ["a"], (_, a) => {
  validateType({ value: a, name: "a" }, [{ fn: isInt, typeName: INT }]);
  return ~a;
});

createGlobalFunction("xor", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [{ fn: isInt, typeName: INT }]);
  validateType({ value: b, name: "b" }, [{ fn: isInt, typeName: INT }]);
  return a ^ b;
});

createGlobalFunction("<<", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [{ fn: isInt, typeName: INT }]);
  validateType({ value: b, name: "b" }, [{ fn: isInt, typeName: INT }]);
  return a << b;
});

createGlobalFunction(">>", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [{ fn: isInt, typeName: INT }]);
  validateType({ value: b, name: "b" }, [{ fn: isInt, typeName: INT }]);
  return a >> b;
});

createGlobalFunction(">>>", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [{ fn: isInt, typeName: INT }]);
  validateType({ value: b, name: "b" }, [{ fn: isInt, typeName: INT }]);
  return a >>> b;
});

// Logic
createGlobalFunction("=", ["a", "b"], (_, a, b) => a === b);

createGlobalFunction("!=", ["a", "b"], (_, a, b) => a !== b);

createGlobalFunction(">", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  return a > b;
});

createGlobalFunction(">=", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  return a >= b;
});

createGlobalFunction("<", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  return a < b;
});

createGlobalFunction("<=", ["a", "b"], (_, a, b) => {
  validateType({ value: a, name: "a" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  validateType({ value: b, name: "b" }, [
    { fn: isInt, typeName: INT },
    { fn: isFloat, typeName: FLOAT }
  ]);
  return a <= b;
});

createGlobalFunction(
  "and",
  ["a", "b", "@rest"],
  (_, a, b, rest) => {
    validateType({ value: a, name: "a" }, [
      { fn: isBoolean, typeName: BOOLEAN }
    ]);
    validateType({ value: b, name: "b" }, [
      { fn: isBoolean, typeName: BOOLEAN }
    ]);

    rest.forEach((arg, idx) => {
      validateType({ value: arg, name: `@rest[${idx}]` }, [
        { fn: isBoolean, typeName: BOOLEAN }
      ]);
    });

    return [a, b, ...rest].reduce((acc, x) => acc && x, true);
  },
  true
);

createGlobalFunction(
  "or",
  ["a", "b", "@rest"],
  (_, a, b, rest) => {
    validateType({ value: a, name: "a" }, [
      { fn: isBoolean, typeName: BOOLEAN }
    ]);
    validateType({ value: b, name: "b" }, [
      { fn: isBoolean, typeName: BOOLEAN }
    ]);

    rest.forEach((arg, idx) => {
      validateType({ value: arg, name: `rest[${idx}]` }, [
        { fn: isBoolean, typeName: BOOLEAN }
      ]);
    });

    return [a, b, ...rest].reduce((acc, x) => acc || x, false);
  },
  true
);

createGlobalFunction("not", ["a"], (_, a) => {
  validateType({ value: a, name: "a" }, [{ fn: isBoolean, typeName: BOOLEAN }]);
  return !a;
});

createGlobalFunction(
  "if",
  ["condition", "then", "else"],
  (_, condition, then, else_) => {
    validateType({ value: condition, name: "condition" }, [
      { fn: isBoolean, typeName: BOOLEAN }
    ]);

    return condition ? then : else_;
  }
);

// Type checks
createGlobalFunction("nil?", ["a"], (_, a) => isNil(a));
createGlobalFunction("int?", ["a"], (_, a) => isInt(a));
createGlobalFunction("float?", ["a"], (_, a) => isFloat(a));
createGlobalFunction("true?", ["a"], (_, a) => isTrue(a));
createGlobalFunction("false?", ["a"], (_, a) => isFalse(a));
createGlobalFunction("string?", ["a"], (_, a) => isString(a));
createGlobalFunction("function?", ["a"], (_, a) => isFunction(a));
createGlobalFunction("list?", ["a"], (_, a) => isList(a));
createGlobalFunction("set?", ["a"], (_, a) => isSet(a));
createGlobalFunction("dict?", ["a"], (_, a) => isDict(a));

// Data structures
// List
createGlobalFunction(
  "list",
  ["@rest"],
  (_, rest) => {
    return [...rest];
  },
  true
);

// Set
createGlobalFunction(
  "set",
  ["@rest"],
  (_, rest) => {
    return new Set(rest);
  },
  true
);

// Dictionary
createGlobalFunction(
  "dict",
  ["@rest"],
  (_, rest) => {
    if (rest.length % 2 !== 0) {
      rest.push(null);
    }

    const dict = new Map();
    rest.forEach((key, idx) => {
      if (idx % 2 !== 0) {
        return;
      }

      dict.set(key, rest[idx + 1]);
    });

    return dict;
  },
  true
);

module.exports = globals;
