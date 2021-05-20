
const _                         = require('underscore');
const { isObject, smartAttrs }  = require('./smart');

module.exports._ = _;

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Just like _.extend, but does not mutate the 1st arg.
 */
module.exports._extend = function() {
  let args = _.reduce(arguments, function(m, arg) {
    return [...m, arg];
  }, [{}]);

  return _.extend(...args);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Just like _extend, but smart about the objects.
 *
 *  Any items that are not objects are skipped.
 *  Any attributes of any object that `isnt()` are skipped.
 *
 *  Aliased as `smartExtend()`.
 */
module.exports.extend = function() {
  let args = _.reduce(arguments, function(m, arg) {
    return [...m, isObject(arg) ? smartAttrs(arg) : arg];
  }, [{}]);

  args = _.compact(args);

  return _.extend(...args);
};
module.exports.smartExtend = module.exports.extend;


//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Merge objects.
 */
module.exports.merge = function() {
  var args = sg.reduce(arguments, [], function(m, arg) {
    return sg.ap(m, sg.reduce(arg, {}, function(m, value, key) {
      return sg.kv(m, key, value);
    }));
  });

  args.unshift({});
  return _.extend.apply(_, args);
};




