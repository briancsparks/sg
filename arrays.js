
const _                         = require('underscore');


// --------------------------------------------------------------------------------------------------------------------
/**
 * Make sure x is an Array.
 *
 * @param {*} x                       - The thing to arrayify.
 * @param {Boolean} skipSplitStrings  - Should not split strings
 *
 * @returns {Array}                   - The arrayified x.
 */
module.exports.arrayify = function(x, skipSplitStrings) {
  if (Array.isArray(x)) {
    return x;
  }
  if (!skipSplitStrings && typeof x === 'string') {
    return x.split(',');
  }
  return _.compact([x]);
};

// --------------------------------------------------------------------------------------------------------------------
// // Ensures x is an array
// module.exports.arrayify = function(x) {
//   if (Array.isArray(x)) {
//     return x;
//   }
//   return [x];
// };

// --------------------------------------------------------------------------------------------------------------------
// Pull the last item off, leaving the beginning alone
const splitLast = module.exports.splitLast = function(arr_) {
  let arr     = Array.from(arr_);
  const last  = arr.pop();

  return [arr, last];
};

// --------------------------------------------------------------------------------------------------------------------
// Pull the last item off, leaving the beginning alone
const splitLastIf = module.exports.splitLastIf = function(arr_, fn) {
  const last = arr_[arr_.length - 1];
  if (fn(last)) {
    return splitLast(arr_);
  }
  return [arr_, null];
};

// --------------------------------------------------------------------------------------------------------------------
// Pull the last item off, leaving the beginning alone
module.exports.splitLastCb = function(arr_) {
  return splitLastIf(arr_, (x) => typeof x === 'function');
};

// --------------------------------------------------------------------------------------------------------------------
/**
 * Just like filter, but returns both lists [items-that-were-true, items-that-were-false].
 *
 * @param {Array}     arr   - The array to split.
 * @param {function}  cb    - The predicate function.
 *
 * @returns {Array[]}
 */
module.exports.splitArray = function(arr, cb) {
  const a = [],  b = [], len = arr.length;

  for (let i = 0; i < len; ++i) {
    if (cb(arr[i])) {
      a.push(arr[i]);
    } else {
      b.push(arr[i]);
    }
  }

  return [a,b];
};

// --------------------------------------------------------------------------------------------------------------------
/**
 * A functional version of flatMap().
 *
 * @param arr
 * @param fn
 * @returns {*}
 */
module.exports.flatMap = function (arr, fn) {
  return arr.flatMap(fn);
};


