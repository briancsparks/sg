
const _                       = require('underscore');
const {isnt,isObject}         = require('./smart');

// --------------------------------------------------------------------------------------------------------------------
/**
 * Like _.reduce, but the parameters are in the right places.
 *
 * @param {*} collection
 * @param {*} initial
 * @param {*} fn
 * @returns
 */
const sg_reduce = module.exports.reduce = function(collection, initial, fn) {
  return _.reduce(collection, fn, initial);
};

// --------------------------------------------------------------------------------------------------------------------
/**
 * A better reduce() to reduce Objects.
 *
 * @param obj
 * @param initial
 * @param fn
 */
module.exports.reduceObj = function (obj, initial, fn) {
  if (!isObject(initial)) {
    return;
  }

  return sg_reduce(obj, initial, function (m, v, k, ...rest) {
    const res_ = fn(m, v, k, ...rest);
    let   res  = res_;

    // The called fn can return an Object, to be merged into the final Object, key-by-key
    if (isObject(res)) {
      return {...m, ...res};
    }

    // They just returned, without returning any data... Just means 'no new data'
    if (_.isUndefined(res)) {
      return m;
    }

    if (Array.isArray(res)) {

      // They just returned, without returning any data... Just means 'no new data'
      if (res.length === 0) {
        return m;
      }

      // Return a one-item array to mean the new value (keeping the key)
      if (res.length === 1) {
        res = [k, ...res];
      }

      if (res[0] === null) {
        res[0] = k;
      }
      let   [key, ...values] = res;
      let   value = values[0];

      // Return a 2-item array to mean [key, value]
      if (res.length === 2) {

        const origValue    = m[key];

        // Merge sub-values together if they are both Objects
        if (isObject(value) && isObject(origValue)) {
          value = {...origValue, ...value};
        }

        return {...m, [key]: value};
      }

      /* otherwise - Many-itemed Array - same as [key, values], just might be easier to return as [key, ...values] */

      return {...m, [key]: values};
    }
  });

};

// --------------------------------------------------------------------------------------------------------------------
/**
 * Acts just like reduce, but stops calling fn once a single non-isnt() value is produced.
 *
 * @param {*} collection       - The Object or Array to reduce
 * @param {*} initial          - The initial state of the result
 * @param {*} fn               - The reducer function
 *
 * @returns {*}                - Whatever the reducer function finds
 */
module.exports.reduceFirst = function(collection, initial, fn) {
  let   found = false;

  return sg_reduce(collection, initial, (m, v, k, ...rest) => {
    if (found)    { return m; }

    const res = fn(m, v, k, ...rest);
    found     = !isnt(res);
    return res;
  });
};

