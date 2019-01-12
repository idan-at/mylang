const { NIL } = require("./types");
const { isList, isSet, isDict } = require("./type-checks");

function join(values) {
  return values.join(" ");
}

function format(val) {
  if (val === null) {
    return NIL;
  }

  if (isList(val)) {
    return `[${join(val)}]`;
  }

  if (isSet(val)) {
    const values = Array.from(val.values());
    return `{${join(values)}}`;
  }

  if (isDict(val)) {
    const entries = Array.from(val.entries());
    const prettyEntries = entries.map(
      pair => `${format(pair[0])}:${format(pair[1])}`
    );
    return `{${join(prettyEntries)}}`;
  }

  return val.toString();
}

module.exports = format;
