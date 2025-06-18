const assert = require('assert');
const { createClient } = require('../src');
assert.strictEqual(typeof createClient, 'function');
console.log('core test passed');
