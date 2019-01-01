class Scope {
  constructor(body) {
    this._body = body
  }

  get iter() {
    return this._body
  }
}

module.exports = Scope
