
const sg                      = require('./extend');
module.exports = sg.extend(sg,
  require('./smart'),
  require('./keys'),
  require('./reduce'),
  require('./kv'),
);

const {isnt, anyIsnt, reduce, kv, numKeys}  = sg;



//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Gets a sub-sub-key.
 */
const deref = module.exports.deref = function(x, keys_) {
  if (isnt(x))      { return; /* undefined */ }
  if (isnt(keys_))  { return; /* undefined */ }

  const keys    = _.isArray(keys_) ? keys_.slice() : keys_.split('.');
  let   result  = x;

  while (keys.length > 0) {
    const key = keys.shift();
    if (!(result = result[key])) {
      // We got a falsy result.  If this was the last item, return it (so, for example
      // we would return a 0 (zero) if looked up.
      if (keys.length === 0) { return result; }

      /* otherwise -- return undefined */
      return; /* undefined */
    }
  }

  return result;
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Sets value on object (this is the workhorse for setOn, setOna.)
 *
 *  Returns the sanitized keys, or false.
 */
const _setOnIt = function(x, keys_, value) {
  if (isnt(x) || isnt(keys_) || isnt(value))  { return false; }

  const keys  = _.isArray(keys_) ? keys_ : keys_.split('.').map(function(x) { return x==='' ? null: x; });

  if (anyIsnt(keys))                          { return false; }

  return keys;
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Sets sub-sub-key of object, and always returns the passed-in value.
 *
 *  setOn(x, 'foo.bar.baz', 42)
 *
 *  x = {foo:{bar:{baz:42}}}
 *
 *  Does not set the sub-object if value is undefined. This allows:
 *
 *      // if abc is not set on  options, x.foo.bar.baz does not get set
 *      setOn(x, 'foo.bar.baz', options.abc);
 */
/*const setOn =*/ module.exports.setOn = function(x, keys_, value) {
  const keys = _setOnIt(x, keys_, value);
  if (keys === false)                       { return value; }

  let   owner = x, key;

  while (keys.length > 1) {
    key = keys.shift();
    owner[key] = owner[key] || {};
    owner = owner[key];
  }

  if (!isnt(key = keys.shift())) {
    owner[key] = value;
  }

  return value;
};


//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Sets sub-sub-key of object as an array, and always returns the passed-in value.
 *
 *  setOna(x, 'foo.bar.baz', 42)
 *
 *  x = {foo:{bar:{baz:[42]}}}
 *
 *  Does not set the sub-object if value is undefined. This allows:
 *
 *      // if abc is not set on  options, x.foo.bar.baz does not get set
 *      setOn(x, 'foo.bar.baz', options.abc);
 */
/*const setOna =*/ module.exports.setOna = function(x, keys_, value) {
  const keys = _setOnIt(x, keys_, value);
  if (keys === false)                       { return value; }

  let   owner = x, key;

  while (keys.length > 1) {
    key           = keys.shift();
    if (isnt(owner[key])) {
      owner[key]  = _.isNumber(keys[0]) ? [] : {};
    }
    owner         = owner[key];
  }

  if (!isnt(key = keys.shift())) {
    owner[key] = owner[key] || [];
    owner[key].push(value);
  }

  return value;
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Merges `aug` into each top-level property of `all`.
 *
 * If `aug` is a string, it is a key into `all`.
 *
 * @param {*} aug
 * @param {*} all
 * @returns
 */
const augmentAllWith = module.exports.augmentAllWith = function(aug, all) {
  if (_.isString(aug))  { return augmentAllWith(all[aug], all); }

  return reduce(all, {}, function(m, v, k) {
    return kv(m, k, sg.merge(aug, v));
  });
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Returns obj[key].
 *
 * sg.choose('a', {a:42}) --> 42
 * sg.choose('a.b', {a:{b:42}}) --> 42
 * sg.choose('x.z', ['key', {key:{z:42},x:{w:'dubya'}}]) --> sg.choose('x.key.z', {key:{z:42},x:{w:'dubya',z:42}}) --> 42
 * sg.choose('x.z', [{z:42},{x:{w:'dubya'}}]) --> sg.choose('x.z', {x:{w:'dubya',z:42}}) --> 42
 *
 * sg.choose('debug', ['prod', {prod:{res:42},debug:{msg:'leak info!'}}]) --> sg.choose('debug', {prod:{res:42},debug:{msg:'leak info!',res:42}}) --> {msg:'leak info!',res:42}
 *
 * @param {*} key
 * @param {*} obj
 * @returns
 */
const choose = module.exports.choose = function(key, obj) {
  if (_.isArray(obj)) {
    return choose(key, augmentAllWith(...obj));
  }

  return deref(obj, key);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Converts to boolean.
 *
 * @param {*} value_
 * @returns
 */
module.exports.trueOrFalse = function(value_) {
  let value = value_;
  if (value === true || value === false)  { return value; }
  if (value === 'true')                   { return true; }
  if (value === 'false')                  { return false; }

  if (_.isString(value)) { value = +value; }    // Convert to number
  return !!value;
};
module.exports.tf = module.exports.trueOrFalse;   // alias

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Just like _.each, except adds three params to the callback:
 *
 *  * The numeric index (call invocation number)
 *  * first
 *  * last
 */
module.exports.each = module.exports._each = function(collection, fn, context) {
  let   numericIndex = 0;
  const length = collection.length || numKeys(collection);

  _.each(collection, function(element, index, coll) {
    const args = [element, index, {collection: coll, i:numericIndex, first:(numericIndex === 0), last:(numericIndex+1 === length), length:length}];
    numericIndex += 1;
    return fn.apply(this, args);
  }, context);
};

