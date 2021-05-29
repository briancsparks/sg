
// --------------------------------------------------------------------------------------------------------------------
module.exports.errback = function (callback, err, msg, other ={}) {
  console.error(msg);
  return callback({...err, ok: false, msg, ...other});
};

// --------------------------------------------------------------------------------------------------------------------
const isProd = module.exports.isProd = module.exports.isProduction = function () {
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV === 'production';
  }
};

// --------------------------------------------------------------------------------------------------------------------
const isDebug = module.exports.isDebug = function () {
  if (isProd())   { return false; }

  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV === 'debug';
  }

  return true;
};

// --------------------------------------------------------------------------------------------------------------------
const isVerbose = module.exports.isVerbose = function () {
  if (isProd())   { return false; }

  if (process.env.NODE_ENV) {
    return process.env.NODE_VERBOSE || process.env.VERBOSE;
  }

  return false;
};

