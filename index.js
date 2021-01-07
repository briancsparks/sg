
const sg                      = require('./extend');

module.exports = sg.extend(sg,
    require('./reduce'),
    require('./kv'),
    require('./smart'),
    require('./strings'),
    require('./objs'),
    require('./keys'),
    require('./misc'),
    require('./ref'),
    require('./arrays'),
    require('./ip')
);

// TODO: inspect
