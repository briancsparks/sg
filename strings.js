


//-----------------------------------------------------------------------------------------------------------------------------
module.exports.to_snake_case = function(key) {
  return key.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

//-----------------------------------------------------------------------------------------------------------------------------
module.exports.toCamelCase = function(key) {
  var parts = key.split(/[^a-zA-Z0-9]/);
  var first = parts.shift();
  return parts.reduce(function(s, part) {
    return s + toUpperWord(part);
  }, first);
}

//-----------------------------------------------------------------------------------------------------------------------------
module.exports.toUpperWord = function(s) {
  if (s.length === 0) { return s; }

  return s[0].toUpperCase() + s.substring(1);
}

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Split on newline for both *nix and Windows.
 *
 * @param {*} string
 * @returns
 */
module.exports.splitLn = function(string) {
  return string.split(/\r?\n/g);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Returns the word with the first char lowercased.
 *
 * @param {*} str
 */
module.exports.toLowerWord = function(str) {
  return str[0].toLowerCase() + sg.rest(str);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Returns the word with the first char uppercased.
 *
 * @param {*} str
 */
module.exports.toUpperWord = function(str) {
  return str[0].toUpperCase() + sg.rest(str).join('');
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Returns if the string or char is lower case.
 *
 * @param {*} str
 * @returns
 */
module.exports.isLowerCase = function(str) {
  return str === str.toLowerCase();
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Returns if the string or char is upper case.
 *
 * @param {*} str
 * @returns
 */
module.exports.isUpperCase = function(str) {
  return str === str.toUpperCase();
};




