
/**
 * @file
 *
 * Many items in the JS / Node ecosystem are _almost_ right. Here are the fixes.
 *
 */

const util      = require('util');
const sg        = require('./extend');


// --------------------------------------------------------------------------------------------------------------------
/**
 * Same as util.inspect, but full-depth and colors.
 *
 * @type {(function(...[*]): (*))|*}
 */
const inspect = module.exports.inspect = function (arg0, ...args) {
  let item = arg0;
  if (typeof arg0 === 'string') {
    item = sg.extend({msg: arg0}, ...args);
  }

  return util.inspect(item, {depth:null, colors: true});
};




