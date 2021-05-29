
const qtest                               = require('./qtest')(module);   /* from within sg */
const {safeJSONParse,safeJSONStringify}   = require('./safe');
const {splitArray}                        = require('./arrays');
const {keyMirror}                         = require('./keys');
const {mkPredicate}                       = require('./smart');
const {reduce}                            = require('./reduce');
const sg                                  = require('./extend');

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
const splitObject = module.exports.splitObject = function(obj, ...args) {
  const cb    = mkPredicate(...args);
  const arr   = Object.keys(obj);

  const [aKeys, bKeys] = splitArray(arr, function (key) {
    return cb(key, obj[key], obj);
  });

  const a = reduce(aKeys, {}, function(m, key) {
    return {...m, [key]: obj[key]};
  });

  const b = reduce(bKeys, {}, function(m, key) {
    return {...m, [key]: obj[key]};
  });

  return [a,b];
};

// ----------------------------
qtest.add('splitObject', function (__, {testAssert2}) {
  const input = {a:1, b:9, c:42, d: -1};
  const [a,b]   = splitObject(input, 'a,d');

  testAssert2(a && a.a, 1, `a.a is wrong`);
  testAssert2(a && a.d, -1, `a.d is wrong`);

  testAssert2(b && b.b, 9, `b.b is wrong`);
  testAssert2(b && b.c, 42, `b.c is wrong`);
});

// // ------------------------------------------------------------------------------------------------------------------------
// function mkPredicate(arg0, ...args) {
//   if (typeof arg0 === 'function') { return arg0; }
//
//   const keys = keyMirror(mkInputStrArray(arg0, ...args));
//
//   return function(key, value, o) {
//     return key in keys;
//   }
// }
//
// // ------------------------------------------------------------------------------------------------------------------------
// function mkInputStrArray(arg0, ...args) {
//   if (!(typeof arg0 !== 'string')) { return; }
//   if (args.length === 0) {
//     return arg0.split(',');
//   }
//
//   return [arg0, ...args];
// }
//
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

// ----------------------------
if (require.main === module) {
  qtest.run();
}
