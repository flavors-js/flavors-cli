'use strict';

const
  assert = require('assert'),
  child = require('child_process'),
  path = require('path');

function testPath(...names) {
  return path.resolve(__dirname, ...names);
}

const
  commonTestPath = testPath('commonTest'),
  cliPath = path.resolve(__dirname, '..', 'index.js');

describe('cli', () => {
  it('prints config', () => {
    assert.strictEqual(child.execSync(`${cliPath} -w ${commonTestPath} -n a print`).toString(), '{\n  "value": 1\n}\n');
  });
  it('initializes environment', () => {
    assert.strictEqual(child.execSync(`${cliPath} -w ${commonTestPath} -n a run 'echo $value'`).toString(), '1\n');
  });
  it('runs not quoted command', () => {
    assert.strictEqual(child.execSync(`${cliPath} -w ${commonTestPath} -n a run echo 1`).toString(), '1\n');
  });
  it('flattens config', () => {
    assert.strictEqual(child.execSync(`${cliPath} -w ${testPath('nested')} -n a run 'echo $nested_value'`).toString(), '1\n');
  });
  it('applies configDirName', () => {
    assert.strictEqual(child.execSync(`${cliPath} -w ${testPath('configDirName')} -n a -d config run 'echo $value'`).toString(), '1\n');
  });
  it('applies configFileName', () => {
    assert.strictEqual(child.execSync(`${cliPath} -w ${testPath('configFileName')} -n a -f custom run 'echo $value'`).toString(), '1\n');
  });
  it('applies loaders', () => {
    assert.strictEqual(child.execSync(`${cliPath} -w ${testPath('loaders')} -n a-b-c -l ${testPath('..', 'node_modules', 'flavors', 'jsonLoader.js')} -l flavors/jsLoader -l flavors-loader-yaml run 'echo $value1$value2$value3'`).toString(), '123\n');
  });
});