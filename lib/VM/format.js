const {NIL} = require('./types')
const {isList, isSet, isDict} = require('./type-checks')

module.exports = val => {
  if (val === null) {
    return NIL
  }

  if (isList(val)) {
    return `(list ${join(val)})`
  }

  if (isSet(val)) {
    const values = Array.from(val.values())
    return `(set ${join(values)})`
  }

  if (isDict(val)) {
    const entries = Array.from(val.entries())
    const prettyEntries = entries.map(pair => `${pair[0]}:${pair[1]}`)
    return `(dict ${join(prettyEntries)})`
  }

  return val.toString()
}

function join(values) {
  return values.join(' ')
}