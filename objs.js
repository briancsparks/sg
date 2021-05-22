
const {safeJSONParse,safeJSONStringify}   = require('./safe');
const sg     = require('./extend');

// ------------------------------------------------------------------------------------------------------------------------

/**
 * Extract a single value out of an object.
 *
 * Many keys can be passed in. All will be removed from the original object, and the result of this function will
 * be the first that is truthy.
 *
 */
module.exports.extract = function(o, ...keys) {
  var result;
  var i, key, value;

  for (i = 0; i < keys.length; i += 1) {
    key = keys[i];
    if (key in o) {
      value = o[key];
      result = result || value;
      delete o[key];
    }
  }

  return result;
}

// ------------------------------------------------------------------------------------------------------------------------

/**
 * Extract many values out of an object.
 *
 * Many keys can be passed in. All will be remoted from the original object, and the result of this function will
 * be an object containing all those key/values.
 *
 */
module.exports.extracts = function(o, ...keys) {
  var result = {};
  var i, key;

  for (i = 0; i < keys.length; i += 1) {
    key = keys[i];
    if (key in o) {
      result[key] = o[key];
      delete o[key];
    }
  }

  return result;
}

// ------------------------------------------------------------------------------------------------------------------------
/**
 * Returns the object, if it is truly an Object, or `def` otherwise.
 *
 * This allows:
 *
 * ```javascript
 *
 *  sg.objekt(x) || {}
 *  sg.objekt(x, {})
 *  sg.objekt(x, {}).attr
 *
 * ```
 *
 * @param {Object|null|undefined} x -- The Object to test
 * @param {*} def                   -- The default
 *
 * @returns {Object|null|undefined|def}
 */
module.exports.objekt = function(x, def) {
  if (isObject(x))  { return x; }
  return def;
};
var objekt = module.exports.objekt;


// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Always returns an Object.
 *
 * * {}  -> x
 * * []  -> {items:x}
 * * *   -> {just:x}
 *
 * @param {*}       x   -- The thing to Object-ify.
 * @param {string}  key -- The object key (replacing `items` or `just`)
 * @returns {Object}
 */
module.exports.asObject = function(x, key) {
  if (isObject(x))          { return x; }
  if (Array.isArray(x))     { return {[key || 'items']:x}; }
  if (isnt(x))              { return {}; }

  return {[key || 'just']:x};
};
var asObject = module.exports.asObject;


// ------------------------------------------------------------------------------------------------------------------------
const deepCopy = module.exports.deepCopy = function (x, ...rest) {
  let   result = safeJSONParse(safeJSONStringify(x));
  if (rest.length === 0) {
    return result;
  }

  // More to add?
  return sg._extend(result, deepCopy(...rest));
};
