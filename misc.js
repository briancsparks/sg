
const _                         = require('underscore');


//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Just like setTimeout, but with the parameters in the right order.
 */
module.exports.setTimeout = function(ms, cb) {
  return setTimeout(cb, ms);
};

/**
 * Restore rest().
 *
 * @returns
 */
module.exports.rest = function() {
  return _.drop.apply(_, arguments);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Restore max().
 *
 * @returns
 */
module.exports.max = function() {
  if (arguments.length === 1) {
    return _.max.apply(_, arguments);
  }
  return _.maxBy.apply(_, arguments);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Restore min().
 *
 * @returns
 */
module.exports.min = function() {
  if (arguments.length === 1) {
    return _.min.apply(_, arguments);
  }
  return _.minBy.apply(_, arguments);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Restore compact.
 *
 * @param {*} arr
 * @returns
 */
module.exports.compact = function(arr) {
  return arr.filter(Boolean);
};



