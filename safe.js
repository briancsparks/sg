/**
 * @file
 */

// --------------------------------------------------------------------------------------------------------------------
/**
 * Stringify the obj, but just return on error.
 *
 * @param obj
 * @param rest
 * @returns {string}
 */
module.exports.safeJSONStringify = function (obj, ...rest) {
  try {
    return JSON.stringify(obj, ...rest);
  } catch(err) {
    // console.error("Error stringifying JSON in safeJSONStringify", str, err);
  }
};

// --------------------------------------------------------------------------------------------------------------------
/**
 * Parse the JSON, but return `undefined` instead of throwing for errors.
 *
 * @param str
 * @returns {any}
 */
const safeJSONParse = module.exports.safeJSONParse = function(str) {
  if (str !== '') {
    try {
      return JSON.parse(str);
    } catch(err) {
     // console.error("Error parsing JSON in safeJSONParse", str, err);
    }
  }
};

// --------------------------------------------------------------------------------------------------------------------
/**
 * If x is already an Object, that's fine. Otherwise, parse it into an object.
 *
 * @param x
 * @returns {*}
 */
module.exports.jsonify = function(x) {
  if (typeof x !== 'string') {
    return x;
  }

  // Its a string... parse it.
  let result;

  result = safeJSONParse(x);

  return result;
};


