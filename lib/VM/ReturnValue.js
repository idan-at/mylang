class ReturnValue {
  constructor(value) {
    this._value = value
  }

  get retVal() {
    return this._value
  }

  toString() {
    return this._value.toString()
  }
}

module.exports = ReturnValue
