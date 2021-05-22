
const sg  = require('./safe');
const {isObject}  = require('./smart');
const {reduce} = require('./reduce');
const {lastOf}  = require('./strings');

module.exports.getContentType = getContentType;

const ctypes = {
  json:   'application/json',
  jsonl:  'application/jsonl',      /* .../json-lines ??? */
  txt:    'text/plain'
};


function getContentType(argv) {
  let   {filename, content, ContentType} = argv;

  filename = filename || argv.Key;
  content  = content  || argv.Body;

  if (ContentType) { return ContentType; }

  if (isObject(content)) {
    return ctypes.json;
  }

  if (typeof content === 'string') {
    if (sg.safeJSONParse(content)) {
      return ctypes.json;
    }

    if (isJSONL(content)) {
      return ctypes.jsonl;
    }
  }

  const ext = extension(filename);
  if (ext) {
    return ctypes[ext];
  }
}

function extension(filename) {
  return lastOf(filename, '.');
}

function isJSONL(str) {
  if (!(typeof str === 'string')) {
    return false;
  }
  const lines = str.split(/\n\r?/g);
  if (lines.length <= 1) {
    return false;
  }

  const result = reduce(lines, true, (m, line) => {
    if (!m) { return m; }
    return sg.safeJSONParse(line) || false;
  });

  return result;
}


