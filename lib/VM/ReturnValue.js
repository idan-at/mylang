class ReturnValue {
  constructor(value) {
    this._value = value
  }

  get retVal() {
    return this._value
  }
}

module.exports = ReturnValue
