// Parse the attributes in an opening tag's text.
// First five capture groups:
// 1: Leading spaces
// 2: Attribute name
// 3: Everything after the name
// 4: Text between matches 2 and 3
// 5: Attribute value, including any quotation marks
/* eslint-disable-next-line no-useless-escape */
const attrRegex = /(\s*)([^ "'>=\^\/]+)((\s*=\s*)((?:"[^"]*")|(?:'[^']*')|(?:\S+)))?/g;

module.exports.parseHtmlAttrs = function(attrs) {
  const ret = [];
  let match;

  while ((match = attrRegex.exec(attrs))) {
    ret.push({
      name: match[2],
      value: match[5]
    });
  }

  return ret;
};

// Find the indices for attribute names and values.
// If an attribute is duplicated, use the first instance that has a value,
// or the first instance if there is no value.
module.exports.inputIndices = function(attributes, openTag, openIndex) {
  const nameLen = openTag.indexOf(" ");
  openTag = openTag.slice(nameLen); // Remove tag name
  openIndex += nameLen + 1; // Open bracket and name
  let match;
  while ((match = attrRegex.exec(openTag))) {
    const name = match[2].trim().toLowerCase();
    if (name && attributes[name]) {
      const attr = attributes[name];

      if (
        attr.valueIndex !== undefined ||
        (!match[5] && attr.nameIndex !== undefined)
      ) {
        continue;
      }

      const nameIndex = openIndex + match.index + match[1].length;
      attr.nameIndex = nameIndex;
      attr.rawEqValue = match[3];
      attr.rawValue = match[5];

      if (match[5]) {
        attr.valueIndex = nameIndex + match[2].length + match[4].length;
      }
    }
  }
  Object.keys(attributes).forEach(function(name) {
    const attr = attributes[name];
    if (attr.valueIndex === undefined) {
      attr.valueIndex = attr.nameIndex;
    }
  });
};
