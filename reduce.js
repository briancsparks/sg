
const _                       = require('underscore');

/**
 * Like _.reduce, but the parameters are in the right places.
 *
 * @param {*} collection
 * @param {*} initial
 * @param {*} fn
 * @returns
 */
module.exports.reduce = function(collection, initial, fn) {
  return _.reduce(collection, fn, initial);
};

