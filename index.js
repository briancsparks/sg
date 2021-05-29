
const sg = require('./extend');

module.exports = sg.extend(sg,
  require('./reduce'),
  require('./kv'),
  require('./smart'),
  require('./safe'),
  require('./debug'),
  require('./strings'),
  require('./objs'),
  require('./keys'),
  require('./misc'),
  require('./time'),
  require('./fixed'),
  require('./ref'),
  require('./http'),
  require('./arrays'),
  require('./ip'),
);

require('./is')(sg, module.exports);

module.exports.qtest = require('./qtest');


// TODO: Add HTTP fns
// TODO: Add flow fns

//     The fullest SG: /cygdrive/d/data/projects/WebStormProjects/bcs/sgX
//     TODO: Get ARGV fns: argvGet, argvExtract, argvPick from SG.lite.js
//     TODO: Get sg.ok from SG:flow.js



