
// Ensures x is an array
module.exports.arrayify = function(x) {
  if (Array.isArray(x)) {
    return x;
  }
  return [x];
};

// Pull the last item off, leaving the beginning alone
const splitLast = module.exports.splitLast = function(arr_) {
  let arr     = Array.from(arr_);
  const last  = arr.pop();

  return [arr, last];
};

// Pull the last item off, leaving the beginning alone
const splitLastIf = module.exports.splitLastIf = function(arr_, fn) {
  const last = arr_[arr_.length - 1];
  if (fn(last)) {
    return splitLast(arr_);
  }
  return [arr_, null];
};

// Pull the last item off, leaving the beginning alone
module.exports.splitLastCb = function(arr_) {
  return splitLastIf(arr_, (x) => typeof x === 'function');
};


