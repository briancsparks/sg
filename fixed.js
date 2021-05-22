
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
const inspect = module.exports.inspect = function (...args) {
  if (args.length === 1) {
    return inspect('', args[0]);
  }

  const [msg ='', obj ={}] = args;
  const item = sg.extend({msg}, obj);

  return util.inspect(item, {depth:null, color: true});
};




