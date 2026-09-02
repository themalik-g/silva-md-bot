'use strict';

const assert = require('assert');
const shPlugin = require('../plugins/sh.js');

async function runTests() {
    console.log('Testing sh.js security fix...');

    // Test 1: Normal command execution using shPlugin.shell
    const res1 = await shPlugin.shell('echo hello world');
    assert.strictEqual(res1.code, 0);
    assert.strictEqual(res1.stdout, 'hello world');

    // Test 2: Shell injection prevention test using shPlugin.shell
    // Passing shell operators inside command should NOT execute injected commands
    const res2 = await shPlugin.shell('echo "hello; echo injected"');
    assert.strictEqual(res2.code, 0);
    assert.strictEqual(res2.stdout, 'hello; echo injected');

    // Test 3: Quoted arguments parsing test
    const parts = shPlugin.parseCommand('node -e "console.log(1+1)"');
    assert.deepStrictEqual(parts, ['node', '-e', 'console.log(1+1)']);

    const res3 = await shPlugin.shell('node -e "console.log(1+1)"');
    assert.strictEqual(res3.code, 0);
    assert.strictEqual(res3.stdout, '2');

    console.log('✅ All sh.js security tests passed successfully!');
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
