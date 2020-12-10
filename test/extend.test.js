
const sg                      = require('..');
const test                    = require('ava');

test('works', t => {
  t.pass();
});

// ====================================================================================================================
// _extend

// --------------------------------------------------------------------------------------------------------------------
// Use _extend just like _.extend
test('sg._extend basic use case', t => {
  const result = sg._extend({}, {key:'value'});

  t.deepEqual(result, {key: 'value'});
});

// --------------------------------------------------------------------------------------------------------------------
// _extend leaves first parameter unchanged
test('sg._extend basic use case, safe', t => {
  const other  = {one: 'two'};
  const result = sg._extend(other, {key:'value'});

  t.deepEqual(result, {one: 'two', key: 'value'});

  // !!! 'other' does not change !!!
  t.deepEqual(other, {one: 'two'});
});

// ====================================================================================================================
// extend

// --------------------------------------------------------------------------------------------------------------------
// values that 'isnt()' do not get copied.
test('sg.extend smart', t => {
  const other  = {one: 'two'};
  const result = sg.extend(other, {key:'value', nothing: null});

  // !!! 'nothing' attribute is not present in result !!!
  t.deepEqual(result, {one: 'two', key: 'value'});
  t.deepEqual(other, {one: 'two'});
});


// --------------------------------------------------------------------------------------------------------------------
// keys that 'isnt()' do not get copied.
test('sg.extend smart nullish key', t => {
  const other  = {one: 'two'};
  const result = sg.extend(other, {key:'value', '': 'foobar'});

  // !!! 'foobar' key is not present in result !!!
  t.deepEqual(result, {one: 'two', key: 'value'});
  t.deepEqual(other, {one: 'two'});
});

