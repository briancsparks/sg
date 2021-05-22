
module.exports = function (sg, expts) {

  expts.is = function (x) {
    return !sg.isnt(x);
  };

  expts.is.js = {};

  // Technically, you have to do the full test to know if it is really an Object (and not a RegExp, for example).
  expts.is.js.object = sg.isObject;

  // But normally, what you really want is not-a-scalar.
  expts.is.object = function (x) {
    return (typeof x === 'object') && !Array.isArray(x);
  }

  return expts.is;
};
