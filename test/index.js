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
  cliPath = path.resolve(__dirname, '..','index.js');

describe('cli', () => {
  it('prints config', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a print`).toString(), '{\n  "value": 1\n}\n');
  });
  it('initializes environment', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a run -c 'echo $value'`).toString(), '1\n');
  });
  it('skips environment initialization', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a run --skip-env -c 'echo $value'`).toString(), '\n');
  });
  it('flattens config', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('nested')} -n a run -c 'echo $nested_value'`).toString(), '1\n');
  });
  it('applies transform', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a -t ${testPath('transform', 'index.js')} run -c 'echo $value' --args '$value' '$value'`).toString(), '2 2 2\n');
  });
  it('applies configDirName', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('configDirName')} -n a -d config run -c 'echo $value'`).toString(), '1\n');
  });
  it('applies configFileName', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('configFileName')} -n a -f custom run -c 'echo $value'`).toString(), '1\n');
  });
  it('applies loaders', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('loaders')} -n a-b-c -l ${testPath('..', 'node_modules', 'flavors', 'jsonLoader.js')} -l flavors/jsLoader -l flavors-loader-yaml run -c 'echo $value1$value2$value3'`).toString(), '123\n');
  });
  describe('runs Node.js module', () => {
    it('with string', () => {
      assert.equal(child.execSync(`${cliPath} -w ${testPath('module')} -n a run -m -c ${testPath('module', 'string.js')} --args '$value' '$value'`).toString(), '1 1 1\n');
    });
    it('with function returning string', () => {
      assert.equal(child.execSync(`${cliPath} -w ${testPath('module')} -n a run -m -c ${testPath('module', 'functionString.js')} --args '$value' '$value'`).toString(), '1 1 1\n');
    });
    it('with function returning child_process.spawn() args', () => {
      assert.equal(child.execSync(`${cliPath} -w ${testPath('module')} -n a run -m -c ${testPath('module', 'spawnArgs.js')} --args '$value' '$value'`).toString(), '1 $value $value\n');
    });
    it('with object', () => {
      assert.equal(child.execSync(`${cliPath} -w ${testPath('module')} -n a run -m -c ${testPath('module', 'object.js')} --args '$value' '$value'`).toString(), '2 $value $value\n');
    });
  });
});