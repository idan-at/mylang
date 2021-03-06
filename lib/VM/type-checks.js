const { FunctionExpression } = require("../AST");

function isNil(value) {
  return value === null;
}

function isTrue(value) {
  return value === true;
}

function isFalse(value) {
  return value === false;
}

function isBoolean(value) {
  return isTrue(value) || isFalse(value);
}

function isString(value) {
  return typeof value === "string";
}

function isInt(value) {
  return Number.isInteger(value);
}

function isFloat(value) {
  return typeof value === "number" && !isInt(value);
}

function isFunction(value) {
  return value instanceof FunctionExpression || typeof value === "function";
}

function isList(value) {
  return Array.isArray(value);
}

function isSet(value) {
  return value instanceof Set;
}

function isDict(value) {
  return value instanceof Map;
}

module.exports = {
  isNil,
  isTrue,
  isFalse,
  isString,
  isInt,
  isFloat,
  isBoolean,
  isFunction,
  isList,
  isSet,
  isDict
};
