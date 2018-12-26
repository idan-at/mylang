function isNil(value) {
  return value === null
}

function isTrue(value) {
  return value === true
}

function isFalse(value) {
  return value === false
}

function isBoolean(value) {
  return isTrue(value) || isFalse(value)
}

function isString(value) {
  return typeof value === 'string'
}

function isInt(value) {
  return Number.isInteger(value)
}

function isFloat(value) {
  return typeof value === 'number' && !isInt(value)
}

module.exports = {
  isNil,
  isTrue,
  isFalse,
  isString,
  isInt,
  isFloat,
  isBoolean
}
