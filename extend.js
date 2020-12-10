
const _                         = require('underscore');
const { isObject, smartAttrs }  = require('./smart');


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
 *  Smart sg.extend().
 */
module.exports.extend = function() {
  let args = _.reduce(arguments, function(m, arg) {
    return [...m, isObject(arg) ? smartAttrs(arg) : arg];
  }, [{}]);

  return _.extend(...args);
};


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




