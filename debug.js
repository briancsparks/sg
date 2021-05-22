

module.exports.errback = function (callback, err, msg, other ={}) {
  console.error(msg);
  return callback({err, ok: false, msg, ...other});
}

