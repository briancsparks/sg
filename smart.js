
const _                       = require('underscore');
const qtest                   = require('./qtest')(module);

let   isnt;
let   anyIsnt;

//-----------------------------------------------------------------------------------------------------------------------------
const isNaN = module.exports.isNaN = Number.isNaN || function(value) {
  // NaNs are never equal to themselves, and are the only values that have this weird property
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN

  let n = Number(value);
  return n !== n;
};


//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Returns `true` if the item is one of the things in JavaScript that cannot
 *  be manipulated (`null`, `undefined`, `NaN`).
 *
 * @param {*} x
 * @returns true or false
 */
isnt = module.exports.isnt = function(x) {
  return _.isNull(x) || _.isUndefined(x) || isNaN(x);
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Returns true if any of the items in `argv` isnt().
 *
 */
anyIsnt = module.exports.anyIsnt = function(argv) {
  return _.reduce(argv, (m, arg) => {
    if (m !== false) { return m; }
    return isnt(arg);
  }, false);
};



//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Is the parameter strictly an Object (and not an Array, or Date, or ...).
 */
const isObject = module.exports.isObject = function(x) {
  if (!_.isObject(x))                     { return false; }
  if (_.isArray(x)    || _.isDate(x))     { return false; }
  if (_.isFunction(x) || _.isRegExp(x))   { return false; }

  return !_.isError(x);
};


//-----------------------------------------------------------------------------------------------------------------------------
/**
 *
 */
const isPod = module.exports.isPod = function(x) {
  if (_.isString(x))            { return true; }
  if (_.isNumber(x))            { return true; }
  if (_.isBoolean(x))           { return true; }
  if (_.isDate(x))              { return true; }

  return _.isRegExp(x);
};


// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Returns true if the item is a valid item (that you can manipulate and use the value.)
 *
 * @param {*} x
 * @returns true or false
 */
const is = module.exports.is = function(x) {
  return x || (x===0) || (x==='') || (x===false);
};


// ------------------------------------------------------------------------------------------------------------------------
/**
 *  Is the value in the list-as-a-sting.
 *
 *  strList : 'a,foo,barbaz'
 *  value   : 'a'
 *
 *  Must do ',a,foo,barbaz,'.indexOf(...)
 */
module.exports.inList = function(strList, value, sep_) {
  var sep = sep_ || ',';

  var surrounded = sep + strList + sep;
  return surrounded.indexOf(sep + value + sep) !== -1;
};




// ------------------------------------------------------------------------------------------------------------------------
const isScalar = module.exports.isScalar = function(x) {
  if (Array.isArray(x)) { return false; }

  const type = typeof x;
  if (':undefined:string:number:boolean:bigint:symbol:'.indexOf(type) !== -1) {
    return true;
  }

  return typeof x !== 'object';
}

//-----------------------------------------------------------------------------------------------------------------------------
module.exports.smartKey = function(key_, preserveCase) {
  var key = key_;
  if (typeof key === 'number') {
    key = ''+key;
  }

  if (typeof key !== 'string')      { return; }   /* returns undefined */

  // Only alnum and underscore
  key = key.replace(/[^a-z0-9_]/ig, '_');

  if (!preserveCase) {
    key = key.toLowerCase();
  }

  // Cannot start with digit
  if (key.match(/^[0-9]/)) {
    key = '_'+key;
  }

  return key;
}

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Makes x the right type.
 */
const smartValue = module.exports.smartValue = function(value) {
  if (_.isString(value)) {
    const valueLC = value.toLowerCase();

    if (valueLC === 'true')       { return true; }
    if (valueLC === 'false')      { return false; }
    if (valueLC === 'null')       { return null; }

    // Numbers
    if (/^[0-9]+$/.exec(value)) { return parseInt(value, 10); }

    // Dates: 2018-12-31T10:08:56.016Z
    if (value.length >= 24 && value[10] === 'T') {
      if (value.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\d/)) {
        return new Date(value);
      }
    }

    // Numbers
    if (/^[0-9]+[.]([0-9]+)?$/.exec(value))   { return +value; }
    if (/^[.][0-9]+$/.exec(value))            { return +value; }

    // RegExps
    const m = value.match(/^[/](.+)[/]$/);
    if (m) {
      return new RegExp(m[1]);
    }

    // JSON?    (re: |startof string (^)|any whitespace ([\t\n\r ]*)|either '{' or '['|
    if (/^[\t\n\r ]*[{[]/.exec(value)) {
      try {
        return JSON.parse(value);
      } catch(e) {}

      try {
        return JSON.parse(value.replace(/'/g, '"'));
      } catch(e) {}

    }
  }

  return value;
};


//-----------------------------------------------------------------------------------------------------------------------------
module.exports.smartNumber = function(value, def =0) {
  var n = +smartValue(value);

  if (isNaN(n)) {
    return def;
  }

  return n;
}

//-----------------------------------------------------------------------------------------------------------------------------
/**
 * Makes each attribute on obj the right type.
 */
const smartAttrs = module.exports.smartAttrs = function(obj) {
  return _.reduce(obj, function(m, value, key) {
    if (isnt(value) || isnt(key) || key === '')   { return m; }

    return {...m, [key]:smartValue(value)};
    // return sg.kv(m, key, smartValue(value));
  }, {});
};

//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Build {k:v}, but do not set the value if k or v are undefined/null.
 *
 *  This allows passing in undefined, and getting the original object
 *  back, without mods.
 */
var kvSmart = module.exports.kvSmart = function(o, k, v) {
  if (arguments.length === 2) {
    return kvSmart(null, o, k);
  }

  o = o || {};

  if (!isnt(k) && !isnt(v)) {
    o[cleanKey(k)] = smartValue(v);
  }

  return o;
};



//-----------------------------------------------------------------------------------------------------------------------------
module.exports.resolveIt = function(x, args) {
  if (typeof x === 'function') {
    return x(...args);
  }

  return x;
}

//-----------------------------------------------------------------------------------------------------------------------------
module.exports.resolveItWithDeref = function(x, args) {
  const [ name, ...rest ] = (args || []);

  var   result = x;

  if (typeof result === 'function') {
    result = result(...args);
  }

  if (!isScalar(result) && (typeof name === 'string') && (name in result)) {
    return result[name];
  }

  return result;
}

// ------------------------------------------------------------------------------------------------------------------------
const mkInputStrArray = module.exports.mkInputStrArray = function(arg0, ...args) {
  if (typeof arg0 !== 'string') { return; }
  if (args.length === 0) {
    return arg0.split(',');
  }

  return [arg0, ...args];
};

// ------------------------------------------------------------------------------------------------------------------------
const mkPredicate = module.exports.mkPredicate = function(arg0, ...args) {
  if (typeof arg0 === 'function') { return arg0; }

  // console.log(`mkPred(${[arg0,...args].length})`, mkInputStrArray(arg0, ...args));
  const keys = keyMirror(mkInputStrArray(arg0, ...args));

  return function(key, value, o) {
    return key in keys;
  }
};

// ----------------------------
qtest.add('mkPredicate', function (testAssert) {
  const cb = mkPredicate('a,b');

  testAssert(cb('b'), `cb(b) should be true`);
  testAssert(!cb('z'), `cb(z) should be false`);
});

// ----------------------------
qtest.add('mkPredicate', function (testAssert) {
  const cb = mkPredicate('a', 'b', 'c');

  testAssert(cb('c'), `cb(c) should be true`);
  testAssert(!cb('d'), `cb(d) should be false`);
});

// ------------------------------------------------------------------------------------------------------------------------
function keyMirror(strings) {
  return strings.reduce((m, s) => {
    return {...m, [s]: s};
  }, {});
}


// ------------------------------------------------------------------------------------------------------------------------
if (require.main === module) {
  qtest.run();
}



