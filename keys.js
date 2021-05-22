
// noinspection JSUnfilteredForInLoop

const _   = require('underscore');
const {isnt}                  = require('./smart');



// ------------------------------------------------------------------------------------------------------------------------
module.exports.firstKey = function(obj) {
  // noinspection LoopStatementThatDoesntLoopJS
  for (let k in obj) {
    return k;
  }
};

// ------------------------------------------------------------------------------------------------------------------------
module.exports.numKeys = function(obj) {
  let num = 0;
  for (let k in obj) {
    num++;
  }

  return num;
};

// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Build {k:v}
 */
const kv = module.exports.kv = function(o, k, v) {
  if (arguments.length === 2) {
    return kv(null, o, k);
  }

  o = o || {};

  if (isnt(k))              { return o; }
  if (_.isUndefined(v))     { return o; }

  o[k] = v;
  return o;
};

// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Build {key:k, vName:v}
 */
const kkvv = module.exports.kkvv = function(o, k, v, vName) {
  if (arguments.length === 2) {
    return kkvv(null, o, k, 'value');
  }

  if (arguments.length === 3) {
    return kkvv(null, o, k, v);
  }

  o         = o || {};
  o.key     = k;
  o[vName]  = v;

  return o;
};

// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Build {k:v}, where the key is a dotted-key
 */
const dottedKv = module.exports.dottedKv = function(o, k, v) {
  if (arguments.length === 2) {

    if (_.isArray(o)) { return dottedKv(null, o.join('.'), k); }
    return kv(null, o, k);
  }

  if (_.isArray(k)) { return dottedKv(o, k.join('.'), v); }

  o = o || {};
  o[k] = v;
  return o;
};

// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Build [v]
 *
 *  Just like kv(), so you can return ap(m, 42) or ap(42).
 *
 *  Will fizzle on null or undefined values.
 *
 * @param {Array}       a     - The array to add to.
 * @param {*}           v     - The value.
 * @param {...Object}   rest  - More values.
 *
 * @returns {Array}           - The augmented array.
 */
const ap = module.exports.ap = function(a, v, ...rest) {
  if (arguments.length === 1)   { return sg.ap(null, arguments[0]); }

  a = a || [];

  if (!_.isUndefined(v)) {
    a.push(v);
  }

  if (rest.length > 0) {
    return ap(a, ...rest);
  }

  return a;
};

// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Pushes the item into the array, and returns the index of where it got
 *  pushed at.
 *
 *  If x is undefined, `_push()` will not push it, and returns undefined.
 */
module.exports.push = function(arr, x) {
  if (_.isUndefined(x))     { return x; }

  let length = arr.length;

  arr.push(x);

  return length;
};
module.exports._push = module.exports.push;

// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Returns the keys of an object.
 *
 *  Just like _.keys, except it will return null or undefined if given an
 *  input that isnt().
 */
module.exports.keys = function(x) {
  if (isnt(x))            { return x; }

  return _.keys(x);
};

// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Makes an object where the key for each item is the same as the value.
 */
module.exports.keyMirror = function(x, sep) {
  let result = {};

  if (isnt(x))            { return x; }

  if (_.isString(x))      { return sg.keyMirror(x.split(sep || ',')); }
  if (sg.isObject(x))     { return sg.keyMirror(_.keys(x)); }

  if (!_.isArray(x))      { return result; }

  _.each(x, function(item) {
    result[item] = item;
  });

  return result;
};


// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Makes the key a valid identifier (letter, digit, or underscore).
 */
module.exports.cleanKey = function(key) {
  return key.replace(/[^a-zA-Z0-9_]/g, '_');
};


